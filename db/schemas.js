var mongoose = require('mongoose');

var schema = {
  user: new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: String,
    account: { type : mongoose.Schema.ObjectId, ref : 'Account' },

    facebook: String,
    facebookDisplay: String,
    twitter: String,
    twitterDisplay: String,
    //google: String,
    //github: String,
    instagram: String,
    instagramDisplay: String,
    //linkedin: String,
    tokens: Array,

    profile: {
      name: { type: String, default: '' },
      gender: { type: String, default: '' },
      location: { type: String, default: '' },
      website: { type: String, default: '' },
      picture: { type: String, default: '' }
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
    policies: Array,
    // posts: [ { type: mongoose.Schema.ObjectId, ref: 'CachedPosts' } ],
    last: {
      timestamp: String,
      twitter: String,
      facebook: String,
      instagram: String
    }
  }),
  cachedPosts: new mongoose.Schema({
    userId: String,
    source: {
      network: String,
      data: Object
    },
    content: {
      text: String,
      img: String
    },
    permalink: String,
    timestamp: String
  }),
  oauthIssues: new mongoose.Schema({
    userId: String,
    last: {
      timestamp: String
    },
    oauthIssues: Object
  })
}

module.exports = schema;
