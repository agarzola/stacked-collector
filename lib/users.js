var mongoose = require('mongoose'),
    db = require('stacked-database'),
    junct = require('stacked-database/junctions')
    async = require('async');

var users = {
  get: function (callback) {
    db.User.find({}, function (err, users) {
      if (err) { return callback(err); }

      if (users && users.length > 0) {
        async.map(users, function (user, asyncCallback) {
          user = user.toObject();
          user.policies = false;
          junct.UserOrgPolicy.find({ userId: user._id }, 'policyId', function (err, policies) {
            if (err || !policies) return asyncCallback(err);

            user.policies = true;
            asyncCallback(null, user);
          })
        }, function (err, results) {
          callback(err, results);
        })
      }
    })
  },

  pool: function (users) {
    var pooledUsers = {};
    users.forEach(function (user) {
      // userIsScrapable = user.tokens && user.tokens.length > 0;
      userIsScrapable = user.networks && Object.keys(user.networks).length > 0 && user.policies;
      if (userIsScrapable) {
        pooledUsers[user._id] = user.networks;
      }
    })
    return pooledUsers;
  }
}

module.exports = users;
