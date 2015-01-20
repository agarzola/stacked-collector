var config = require('../config')
    ;

var batcher = function (items, limit) {
  limit = limit && typeof(limit) === 'number' ? limit : config.batchLimit;

  var batchArray = [];
  var counter = 0;

  items.forEach(function (item, index) {
    batchIndex = Math.floor(counter / limit);

    if (!batchArray[batchIndex]) batchArray[batchIndex] = [];
    batchArray[batchIndex].push(item);

    counter++;
  })

  return batchArray;
}

module.exports = batcher;
