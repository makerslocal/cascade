var db  = require('../db')
  , log = require('logule').init(module, 'user');

// ------------------------------------------------------------------------------------
// User model
// ------------------------------------------------------------------------------------

User = function() {
  // ..
};

model = module.exports = {
  // ..
};

/**
 * find single user by email
 *
 * @param email
 * @param fn
 */

model.findUserByEmail = function(email, fn) {
  this._findUserByField({
    key   : 'email',
    value : email
  }, fn);
};

/**
 * find single user by id
 *
 * @param id
 */

model.findUserById = function(id, fn) {
  console.log("test");
  this._findUserByField({
    key   : 'id',
    value : id
  }, fn);
};

/**
 * find single user by username
 *
 * @param username
 */

model.findUserByUsername = function(username, fn) {
  this._findUserByField({
    key   : 'username',
    value : username
  }, fn);
};

/**
 * helper to retrieve users
 *
 * @param field key value pair object
 * @param callback callback
 * @private
 */

model._findUserByField = function(field, fn) {
  db.serialize(function() {
    var query = 'SELECT * FROM users WHERE ' + field.key + ' = ?';
    db.get(query, field.value, function(e, row) {
      if (e) {
        log.error(e.toString());
      }
      fn(row);
    });
  });
};

//// ------------------------------------------------------------------------------------
//// Instance
//// ------------------------------------------------------------------------------------
//
//module.exports = (function() {
//  return new User();
//}());



