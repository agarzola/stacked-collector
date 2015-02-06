var db = require('stacked-database'),
    updateOptions = { upsert: true },
    async = require('async');

var postProcessor = function (response, callback) {
  var last, posts, oauthIssues;

  async.each(Object.keys(response),
    function (userId, eachCallback) {
      lastScraped = response[userId].lastScraped ? response[userId].lastScraped : null;
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
          if (lastScraped) {
            processUserLast(userId, lastScraped, function (err) {
              return parallelCallback(err);
            })
          } else { parallelCallback(null) }
        },

        storeErrors: function (parallelCallback) {
          if (oauthIssues) {
            processErrors(userId, lastScraped, oauthIssues, function (err) {
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
  posts.forEach(function (post, index) {
    post.userId = userId;
    var currentPost = new db.CachedPost(post);

    currentPost.save(function (err, result) {
      if (index === posts.length - 1) return callback(err);
    })
  });
}

var processUserLast = function (userId, lastScraped, callback) {
  var userUpdates = {}
  Object.keys(lastScraped).forEach(function (lastKey) {
    if (lastKey === 'timestamp') {
      userUpdates.lastScraped = this[lastKey];
    } else {
      userUpdates['networks.' + lastKey + '.lastScraped'] = this[lastKey];
    }
  }, lastScraped)

  db.User.update({ _id: userId }, userUpdates, updateOptions, function (err) {
    return callback(err);
  })
}

var processErrors = function (userId, lastScraped, oauthIssues, callback) {
  var issuesObj = {
    lastScraped: lastScraped.timestamp
  }

  Object.keys(oauthIssues).forEach(function (issueSource) {
    issuesObj['reports.' + issueSource] = this[issueSource];
    // console.log(issuesObj['oauthIssues.' + issueSource])
  }, oauthIssues)

  db.OauthIssue.update({ userId: userId }, issuesObj, updateOptions, function (err) {
    return callback(err);
  })
}
