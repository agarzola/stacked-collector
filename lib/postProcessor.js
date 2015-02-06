var mongoose = require('mongoose'),
    UsersDB = mongoose.model('users', require('../db/schemas').user),
    CachedPostsDB = mongoose.model('cachedposts', require('../db/schemas').cachedPosts),
    oauthIssuesDB = mongoose.model('oauthIssues', require('../db/schemas').oauthIssues),
    updateOptions = { upsert: true },
    async = require('async');

var postProcessor = function (response, callback) {
  var last, posts, oauthIssues;

  async.each(Object.keys(response),
    function (userId, eachCallback) {
      last = response[userId].last ? response[userId].last : null;
      posts = response[userId].posts && response[userId].posts.length > 0 ? response[userId].posts : null;
      oauthIssues = response[userId].oauthIssues ? response[userId].oauthIssues : null;

      async.parallel({
        cachePosts: function (parallelCallback) {
          if (posts) {
            processUserPosts(userId, posts, function (err) {
              return parallelCallback(err);
            })
          } else { parallelCallback(null) }
        },

        storeLast: function (parallelCallback) {
          if (last) {
            processUserLast(userId, last, function (err) {
              return parallelCallback(err);
            })
          } else { parallelCallback(null) }
        },

        storeErrors: function (parallelCallback) {
          if (oauthIssues) {
            processErrors(userId, last, oauthIssues, function (err) {
              return parallelCallback(err);
            })
          } else { parallelCallback(null) }
        }
      }, function (err) {
        return eachCallback(err);
      })
    }, function (err) {
      return callback(err);
    }
  )
}

module.exports = postProcessor;

var processUserPosts = function (userId, posts, callback) {
  if (posts.length > 0) {
    posts.forEach(function (post) {
      post.userId = userId;
      var currentPost = new CachedPostsDB(post);

      currentPost.save(function (err, result) {
        return callback(err);
      })
    });
  }
}

var processUserLast = function (userId, last, callback) {
  var userUpdates = {}
  Object.keys(last).forEach(function (lastKey) {
    userUpdates['last.' + lastKey] = this[lastKey]
  }, last)

  UsersDB.update({ _id: userId }, userUpdates, updateOptions, function (err) {
    return callback(err);
  })
}

var processErrors = function (userId, last, oauthIssues, callback) {
  var issuesObj = {
    'last.timestamp': last.timestamp,
  }

  Object.keys(oauthIssues).forEach(function (issueSource) {
    issuesObj['oauthIssues.' + issueSource] = this[issueSource];
    // console.log(issuesObj['oauthIssues.' + issueSource])
  }, oauthIssues)

  oauthIssuesDB.update({ userId: userId }, issuesObj, updateOptions, function (err) {
    return callback(err);
  })
}
