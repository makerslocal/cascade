/**
 * Module dependencies
 */

var config      = require('./config');
var fs          = require('fs');
var log         = require('logule').init(module, 'model');
var path        = require('path');
var Sequelize   = require('sequelize');
var util        = require('util');

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

var Transaction = sequelize.import('./models/transaction.js');
var User = sequelize.import('./models/user.js');

User.hasMany(Transaction, {as: 'Transactions', foreignKey : 'user_id'});

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