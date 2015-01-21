var collector = require('./lib/collector'),
    async = require('async'),
    counter = 1;

async.forever(
  function (next) {
    collector(null, function (err, users) {
      console.log('called ' + counter + ' times')
      counter++;
      next(err, users)
    })
  },
  function (err) {
    if (err) { throw err; }
  }
)
