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
    resetPasswordExpires: Date
  }),
  cachedPosts: new mongoose.Schema({
    userId: String,
    last: {
      timestamp: String,
      twitter: String,
      facebook: String,
      instagram: String
    },
    posts: { type: Array, default: [] }
  })
}

module.exports = schema;
