var itemProcessor = function (itemObject) {
  var itemArray = [];

  Object.keys(itemObject).forEach(function (user, index) {
    var singleUser = this[user];
    singleUser.userId = user;

    itemArray.push(singleUser);
  }, itemObject)

  return itemArray;
}

module.exports = itemProcessor;
