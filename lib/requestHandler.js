// var http = require('http');

var requestHandler = function (item, callback) {
  setTimeout(callback, 1000, null, 1);
}

module.exports = requestHandler;
