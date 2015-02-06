var collector = require('./lib/collector'),
    async = require('async'),
    db = require('stacked-database'),
    counter = 1;

db.connect(function (err) {
  if (err) throw err;

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
})
