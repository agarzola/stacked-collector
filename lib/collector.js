var async = require('async'),
    Users = require('./users'),
    util = require('./util'),
    requestHandler = require('./requestHandler'),
    postProcessor = require('./postProcessor'),
    config = require('../config');

var collector = function (users, processCallback) {
  var userPool, userBatches, roundedOut;
  async.series({
    createUserBatches: function (asyncCallback) {
      if (!users) {
        Users.get(function (err, users) {
          userPool = Users.pool(users);
          userBatches = util.batcher(userPool);
          asyncCallback(err);
        })
      } else {
        userPool = Users.pool(users);
        userBatches = util.batcher(userPool);
        asyncCallback(err);
      }
    },
    sendBatchesToScraper: function (asyncCallback) {
      async.eachSeries(userBatches, batchIterator, function (err) {
        // We’re done with the batches! Create new batches and start over again:
        processCallback(err);
      })
    }
  })
}

module.exports = collector;

var batchIterator = function (batch, iteratorCallback) {
  requestHandler(batch, function (err, posts) {
    if (err) { return iteratorCallback(err); }

    postProcessor(posts, function (err) {
      iteratorCallback(err);
    })
  })
}
