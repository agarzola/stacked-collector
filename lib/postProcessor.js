var postProcessor = function (posts, callback) {
  var last, posts, errors;
  Object.keys(posts).forEach(function (user, index) {
    last = this[user].last ? this[user].last : null;
    posts = this[user].posts && this[user].posts.length > 0 ? this[user].posts : null;
    errors = this[user].errors && this[user].errors.length > 0 ? this[user].errors : null;

    if (last || posts) {
      processUserPosts(user, last, posts, function (err) {
        if (err) { return callback(err); }
      });
    }

    if (errors) {
      processErrors(user, errors, function (err) {
        if (err) { return callback(err); }
      })
    }
  }, posts)

  callback(null, posts, errors);
}

module.exports = postProcessor;

var processUserPosts = function (user, last, posts, callback) {
  // Store user posts and report back with any http/db errors
}

var processErrors = function (user, errors, callback) {
  // Store API errors and report back with any http/db errors
}