var db  = require('../db')
  , log = require('logule').init(module, 'user');

// ------------------------------------------------------------------------------------
// User model
// ------------------------------------------------------------------------------------

var User = function() {
  // ..
};

/**
 * find single user by email
 * @param email
 * @param callback
 */

User.prototype.findUserByEmail = function(email, callback) {
  this._findUserByField({
    key   : 'email',
    value : email
  }, callback);
};

/**
 * find single user by id
 * @param id
 * @param callback
 */

User.prototype.findUserById = function(id, callback) {
  this._findUserByField({
    key   : 'id',
    value : id
  }, callback);
};

/**
 * find single user by username
 * @param username
 * @param callback
 */

User.prototype.findUserByUsername = function(username, callback) {
  this._findUserByField({
    key   : 'username',
    value : username
  }, callback);
};

/**
 * helper to retrieve users
 * @param field key value pair object
 * @param callback callback
 * @private
 */

User.prototype._findUserByField = function(field, callback) {
  db.serialize(function() {
    var query = 'SELECT * FROM users WHERE ' + field.key + ' = ?';
    db.get(query, field.value, function(e, row) {
      if (e) {
        log.error(e.toString());
      }
      callback(row);
    });
  });
};

// ------------------------------------------------------------------------------------
// Instance
// ------------------------------------------------------------------------------------

module.exports = (function() {
  return new User();
}());

