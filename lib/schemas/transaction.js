var schema  = require('../schema.js')
  , log     = require('logule').init(module, 'transaction');

// ------------------------------------------------------------------------------------
// Transaction schema
// ------------------------------------------------------------------------------------

var Transaction = schema.define('transactions', {
  id        : Number,
  email     : String,
  username  : String
});

// ------------------------------------------------------------------------------------
// Custom functions
// ------------------------------------------------------------------------------------

///**
// * find a single user by username
// * @param username
// * @param fn
// */
//
//Transaction.prototype.findUserByUsername = function(username, fn) {
//  Transaction.find({
//    where: {
//      username: username
//    },
//    limit: 1
//  }, function (err, user) {
//    if (err) {
//      log.error(err);
//    }
//    fn(user);
//  });
//}

// ------------------------------------------------------------------------------------
// Instance
// ------------------------------------------------------------------------------------

module.exports = (function() {
  return new Transaction();
}());