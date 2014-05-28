var db  = require('../db')
  , log = require('logule').init(module, 'user');

// ------------------------------------------------------------------------------------
// User schema
// ------------------------------------------------------------------------------------

var User = db.define('users', {
  id        : Number,
  email     : String,
  username  : String
});

// ------------------------------------------------------------------------------------
// Custom functions
// ------------------------------------------------------------------------------------

/**
 * find a single user by username
 * @param username
 * @param fn
 */

User.prototype.findUserByUsername = function(username, fn) {
  User.find({
    where: {
      username: username
    },
    limit: 1
  }, function (err, user) {
    if (err) {
      log.error(err);
    }
    fn(user);
  });
}

// ------------------------------------------------------------------------------------
// Instance
// ------------------------------------------------------------------------------------

module.exports = (function() {
  return new User();
}());