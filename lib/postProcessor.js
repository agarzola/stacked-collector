var mongoose = require('mongoose'),
    UsersDB = mongoose.model('users', require('../db/schemas').user),
    CachedPostsDB = mongoose.model('cachedposts', require('../db/schemas').cachedPosts),
    oAuthErrorsDB = mongoose.model('oautherrors', require('../db/schemas').oAuthErrors),
    updateOptions = { upsert: true };

require('../db/mongooseSetup')

var postProcessor = function (posts, callback) {
  var last, posts, errors;
  Object.keys(posts).forEach(function (user, index) {
    last = this[user].last ? this[user].last : null;
    posts = this[user].posts && this[user].posts.length > 0 ? this[user].posts : null;
    errors = this[user].errors && this[user].errors.length > 0 ? this[user].errors : null;

    if (posts) {
      processUserPosts(user, posts, function (err) {
        if (err) { return callback(err); }
      });
    }

    if (last) {
      processUserLast(user, last, function (err) {
        if (err) { return callback(err); }
      })
    }

    if (errors) {
      processErrors(user, last, errors, function (err) {
        if (err) { return callback(err); }
      })
    }
  }, posts)
  callback(null, posts, errors);
}

module.exports = postProcessor;

var processUserPosts = function (user, posts, callback) {
  if (posts.length > 0) {
    posts.forEach(function (post) {
      post.userId = user;
      var currentPost = new CachedPostsDB(post);

      currentPost.save(function (err, result) {
        if (err) return callback(err);
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
    if (err) return callback(err);
  })
}

var processErrors = function (user, last, errors, callback) {
  var errorsObj = {
    'last.timestamp': last.timestamp,
    $push: {
      oautherrors: {
        $each: errors,
        $position: 0
      }
    }
  }

  oAuthErrorsDB.update({ userId: user }, errorsObj, updateOptions, function (err) {
    callback(err);
  })
}
