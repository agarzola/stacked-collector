var should = require('should'),
    collector = require('../lib/collector'),
    batcher = require('../lib/batcher'),
    cycler = require('../lib/cycler'),
    testUsers = require('./data/users'),
    userProcessor = require('../lib/userProcessor'),
    userArray, batchedUsers

describe('User Processor', function () {
  it('should return an array of users', function (done) {
    userArray = userProcessor(testUsers)

    userArray.should.be.an.instanceOf(Array).and.have.lengthOf(11)
    done()
  })
})

describe('Batcher', function () {
  it('should return an array of batches', function (done) {
    batchedUsers = batcher(userArray, 5)

    batchedUsers.should.be.an.instanceOf(Array).and.have.lengthOf(3)
    batchedUsers[0].should.be.an.instanceOf(Array).and.have.lengthOf(5)
    batchedUsers[1].should.be.an.instanceOf(Array).and.have.lengthOf(5)
    batchedUsers[2].should.be.an.instanceOf(Array).and.have.lengthOf(1)
    batchedUsers.limit.should.equal(5)

    done()
  })
})

describe('Cycler', function () {
  it('should fill the last batch with users from the top of the list', function (done) {
    cycler(batchedUsers, userArray, function (err, lastBatch, updatedUsers) {
      batchedUsers[batchedUsers.length - 1] = lastBatch

      batchedUsers[2].should.be.an.instanceOf(Array).and.have.lengthOf(5)
      updatedUsers.should.be.an.instanceOf(Array).and.have.lengthOf(7)

      done()
    })
  })
})
