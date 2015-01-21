var config = require('../../config')
    ;

var batcher = function (items, limit) {
  limit = limit && typeof(limit) === 'number' ? limit : config.batchLimit;

  var batchArray = [];
  var counter = 0;

  Object.keys(items).forEach(function (itemKey, index) {
    batchIndex = Math.floor(counter / limit);

    if (!batchArray[batchIndex]) batchArray[batchIndex] = {};
    batchArray[batchIndex][itemKey] = items[itemKey];

    counter++;
  })

  batchArray.limit = limit;

  return batchArray;
}

module.exports = batcher;
