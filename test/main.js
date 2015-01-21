var should = require('should'),
    collector = require('../lib/collector'),
    util = require('../lib/util'),
    testUsers = require('./data/users'),
    itemProcessor = require('../lib/itemProcessor'),
    userArray, batchedUsers

describe('User Processor', function () {
  it('should return an array of users', function (done) {
    userArray = itemProcessor(testUsers)

    userArray.should.be.an.instanceOf(Array).and.have.lengthOf(11)
    done()
  })
})

describe('Batcher', function () {
  it('should return an array of batches', function (done) {
    batchedUsers = util.batcher(userArray, 5)

    batchedUsers.should.be.an.instanceOf(Array).and.have.lengthOf(3)
    batchedUsers[0].should.be.an.instanceOf(Object)
    batchedUsers[1].should.be.an.instanceOf(Object)
    batchedUsers[2].should.be.an.instanceOf(Object)
    batchedUsers.limit.should.equal(5)

    done()
  })
})
