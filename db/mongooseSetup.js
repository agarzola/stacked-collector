// Bring Mongoose into the app
var mongoose = require( 'mongoose' );

var uriUtil = require('mongodb-uri'),
    mongodbUri = require('../lib/credentials/secrets').db,
    mongooseUri = uriUtil.formatMongoose(mongodbUri);

var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } } };

// Create the database connection
mongoose.connect(mongooseUri, options);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  // console.log('Mongoose default connection open to MongoLab.');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  // console.log('Mongoose default connection disconnected.');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    // console.log('Mongoose default connection disconnected through app termination.');
    process.exit(0);
  });
});
