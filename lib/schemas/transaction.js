var schema  = require('../schema.js')
  , log     = require('logule').init(module, 'transaction');

// ------------------------------------------------------------------------------------
// Transaction schema
// ------------------------------------------------------------------------------------

var Transaction = schema.define('transactions', {
  id        : Number,
  users_id  : Number,
  timestamp : Number,
  usd       : Number
});

// ------------------------------------------------------------------------------------
// Custom functions
// ------------------------------------------------------------------------------------

/**
*
* @param username
* @param fn
*/

Transaction.prototype.findTransactionsForUser = function(username, fn) {

}

// ------------------------------------------------------------------------------------
// Instance
// ------------------------------------------------------------------------------------

module.exports = (function() {
  return new Transaction();
}());