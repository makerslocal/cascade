var schema  = require('../schema.js')
  , log     = require('logule').init(module, 'transaction');

// ------------------------------------------------------------------------------------
// Transaction schema
// ------------------------------------------------------------------------------------

var TransactionSchema = schema.define('transactions', {
  id        : Number,
  users_id  : Number,
  timestamp : Number,
  usd       : Number
});

// ------------------------------------------------------------------------------------
// Instance
// ------------------------------------------------------------------------------------

module.exports = TransactionSchema;