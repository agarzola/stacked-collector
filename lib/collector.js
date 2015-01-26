var async = require('async'),
    Users = require('./users'),
    util = require('./util'),
    requestHandler = require('./requestHandler'),
    postProcessor = require('./postProcessor'),
    config = require('../config'),
    secrets = require('./credentials/secrets'),
    stackedScraper = require('stacked-scraper')(secrets);

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
  setTimeout(stackedScraper, config.throttle, batch, function (err, response) {
    if (err) { return iteratorCallback(err); }
    // console.log(response)

    postProcessor(response, function (err) {
      iteratorCallback(err);
    })
  })
}
