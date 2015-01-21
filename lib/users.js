var mongoose = require('mongoose')
    UsersDB = mongoose.model('users', require('../db/schemas').user);

require('../db/mongooseSetup')

var users = {
  get: function (callback) {
    UsersDB.find({}, function (err, users) {
      if (err) { return callback(err); }
      callback(null, users);
    })
  },

  pool: function (users) {
    var pooledUsers = {};
    users.forEach(function (user) {
      if (user.tokens && user.tokens.length > 0) {
        pooledUsers[user.id] = {};
        user.tokens.forEach(function (token, tokenIndex) {
          pooledUsers[user.id][token.kind] = {};
          Object.keys(token).forEach(function (tokenKey) {
            if (tokenKey !== 'kind') {
              pooledUsers[user.id][token.kind][tokenKey] = token[tokenKey];
              pooledUsers[user.id][token.kind].userId = user[token.kind];
            }
          })
        })
      }
    })
    return pooledUsers;
  }
}

module.exports = users;
