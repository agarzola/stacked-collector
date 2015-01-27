var mongoose = require('mongoose'),
    UsersDB = mongoose.model('users', require('../db/schemas').user),
    CachedPostsDB = mongoose.model('cachedposts', require('../db/schemas').cachedPosts),
    oauthIssuesDB = mongoose.model('oauthIssues', require('../db/schemas').oauthIssues),
    updateOptions = { upsert: true },
    async = require('async');

var postProcessor = function (response, callback) {
  var last, posts, oauthIssues;

  async.each(Object.keys(response),
    function (user, eachCallback) {
      last = response[user].last ? response[user].last : null;
      posts = response[user].posts && response[user].posts.length > 0 ? response[user].posts : null;
      oauthIssues = response[user].oauthIssues ? response[user].oauthIssues : null;

      async.parallel({
        cachePosts: function (parallelCallback) {
          if (posts) {
            processUserPosts(user, posts, function (err) {
              parallelCallback(err);
            })
          } else { parallelCallback(null) }
        },

        storeLast: function (parallelCallback) {
          if (last) {
            processUserLast(user, last, function (err) {
              parallelCallback(err);
            })
          } else { parallelCallback(null) }
        },

        storeErrors: function (parallelCallback) {
          if (oauthIssues) {
            processErrors(user, last, oauthIssues, function (err) {
              parallelCallback(err);
            })
          } else { parallelCallback(null) }
        }
      }, function (err) {
        eachCallback(err);
      })
    }, function (err) {
      callback(err);
    }
  )
}

module.exports = postProcessor;

var processUserPosts = function (user, posts, callback) {
  if (posts.length > 0) {
    posts.forEach(function (post) {
      post.userId = user;
      var currentPost = new CachedPostsDB(post);

      currentPost.save(function (err, result) {
        callback(err);
      })
    });
  }
}

var processUserLast = function (user, last, callback) {
  var userUpdates = {}
  Object.keys(last).forEach(function (lastKey) {
    userUpdates['last.' + lastKey] = this[lastKey]
  }, last)

  UsersDB.update({ _id: user }, userUpdates, updateOptions, function (err) {
    callback(err);
  })
}

var processErrors = function (user, last, oauthIssues, callback) {
  var issuesObj = {
    'last.timestamp': last.timestamp,
  }

  Object.keys(oauthIssues).forEach(function (issueSource) {
    issuesObj['oauthIssues.' + issueSource] = this[issueSource];
    // console.log(issuesObj['oauthIssues.' + issueSource])
  }, oauthIssues)

  oauthIssuesDB.update({ userId: user }, issuesObj, updateOptions, function (err) {
    callback(err);
  })
}
