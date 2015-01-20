var userProcessor = function (userObject) {
  var userArray = [];

  Object.keys(userObject).forEach(function (user, index) {
    var singleUser = this[user];
    singleUser.userId = user;

    userArray.push(singleUser);
  }, userObject)

  return userArray;
}

module.exports = userProcessor;
