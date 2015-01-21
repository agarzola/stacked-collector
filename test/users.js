var should = require('should'),
    Users = require('../lib/users')

var arrayOfUsers = require('./data/usersfromdb')

describe('User', function () {
  it('should get users from the database', function (done) {
    Users.get(function (err, users) {
      users.should.be.an.instanceOf(Array)
      users[0].id.should.be.an.instanceOf(String)
      done()
    })
  })

  it('should return an object with each user as a property with network tokens', function (done) {
    Users.get(function (err, users) {
      pooledUsers = Users.pool(users)

      pooledUsers.should.be.an.instanceOf(Object)
      arrayOfUsers.forEach(function (user) {
        if (user.tokens.length > 0) {
          pooledUsers[user.id].should.be.an.instanceOf(Object)
          user.tokens.forEach(function (token) {
            pooledUsers[user.id][token.kind].should.be.an.instanceOf(Object)
            pooledUsers[user.id][token.kind].userId.should.be.an.instanceOf(String)
            Object.keys(token).forEach(function (tokenKey) {
              if (tokenKey !== 'kind') {
                pooledUsers[user.id][token.kind][tokenKey].should.be.an.instanceOf(String)
              }
            })
          })
        }
      })

      done()
    })
  })
})
