/**
 * Module dependencies
 */

var fs          = require('fs')
  , log         = require('logule').init(module, 'model')
  , path        = require('path')
  , Sequelize   = require('sequelize')
  , util        = require('util')
  // ..
  , config      = require('./config');

/**
 * Initialize and configure Sequelize
 *
 * @type {Sequelize}
 * @see https://github.com/sequelize/sequelize
 */

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

/**
 * Import each model and make associations, if any
 */

var User = sequelize.import('./models/user.js')
  , Transaction = sequelize.import('./models/transaction.js');

User.hasMany(Transaction, {as: 'Transactions', foreignKey : 'users_id'});

/**
 * Expose sequelize
 *
 * @type {Sequelize}
 */

module.exports.sequelize = sequelize;

/**
 * Expose our models
 *
 * @type {{User: *, Transaction: *}}
 */

module.exports = {
  'User' : User,
  'Transaction' : Transaction
};