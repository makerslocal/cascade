var log         = require('logule').init(module, 'user')
  // ..
  , schema      = require('../schema.js')
  , Transaction = require('./transaction.js');

// ------------------------------------------------------------------------------------
// User schema
// ------------------------------------------------------------------------------------

var UserSchema = schema.define('users', {
  id        : Number,
  email     : String,
  username  : String
});

// ..

UserSchema.hasMany(Transaction, {
  as: 'transactions',
  foreignKey: 'users_id'
});

// ------------------------------------------------------------------------------------
// Schema helpers, returns User objects
// ------------------------------------------------------------------------------------

var User = function() {
  // ..
};

/**
 *
 * @param username
 * @param fn
 */

User.prototype.findUserByUsername = function(username, fn) {
  UserSchema.find({
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
};

// ------------------------------------------------------------------------------------
// Instance
// ------------------------------------------------------------------------------------

module.exports = (function() {
  return new User();
}());

module.exports.schema = UserSchema;