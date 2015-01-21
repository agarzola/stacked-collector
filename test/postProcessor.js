var should = require('should'),
    postProcessor = require('../lib/postProcessor'),
    samplePosts = require('./data/samplePosts');

describe('Post Processor', function () {
  it('should separate posts from errors', function (done) {
    postProcessor(samplePosts, function (err, posts, errors) {
      posts.should.be.an.instanceOf(Array).and.have.lengthOf(2)
      errors.should.be.an.instanceOf(Array).and.have.lengthOf(1)
      done()
    })
  })
})
