var cycler = function (batches, items, callback) {
  var lastBatch = batches[batches.length - 1];
  var strippedItems = items.slice(0, (batches.limit - lastBatch.length));
  items.splice(0, strippedItems.length);

  lastBatch = lastBatch.concat(strippedItems);

  callback(null, lastBatch, items);
}

module.exports = cycler;
