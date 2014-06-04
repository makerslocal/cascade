var fs          = require('fs')
  , log         = require('logule').init(module, 'model')
  , path        = require('path')
  , Sequelize   = require('sequelize')
  , util        = require('util')
  // ..
  , config      = require('./config');

// ------------------------------------------------------------------------------------
// Sequelize conf
// ------------------------------------------------------------------------------------

var sequelize = new Sequelize('database', 'username', 'password', {
  define: {
    timestamps: false
  },
  dialect: 'sqlite',
  logging: function(msg) {
    log.info(msg);
  },
  storage: config.sqlite.db
});

module.exports.sequelize = sequelize;

// ------------------------------------------------------------------------------------
// Import our models
// ------------------------------------------------------------------------------------

var User = sequelize.import('./models/user.js')
  , Transaction = sequelize.import('./models/transaction.js');

User.hasMany(Transaction, {as: 'Transactions', foreignKey : 'users_id'});

//..

module.exports = {
  'User' : User,
  'Transaction' : Transaction
};