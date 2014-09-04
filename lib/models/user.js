
/**
 * Module dependencies
 */

var config    = require('./config.js');
var log       = require('logule').init(module, 'user');
var mandrill  = require('node-mandrill')(config.mandrillApiKey);

/**
 * User model
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */

module.exports = function(sequelize, DataTypes) {

  log.info('importing..');

  return sequelize.define('User', {
    id        : DataTypes.INTEGER,
    balance   : DataTypes.DECIMAL,
    email     : DataTypes.STRING,
    nfcID     : DataTypes.STRING,
    usbSerial : DataTypes.STRING,
    username  : DataTypes.STRING
  },
    {
    instanceMethods: {
      /**
       * withdraw `amount`
       * @param amount
       * @param done
       */
      withdraw: function(amount, done) {
        if (this.balance < amount) {
          return done(false);
        }

        this.decrement('balance', {
          by: amount
        })
          .error(function(err) {
            //todo: logging
            done(false);
          })
          .success(function() {
            done(true);
          });
      },
      /**
       * send user email with current balance
       */
      notifyBalance: function(done) {
        if (!this.email) {
          log.error(this.username + ' has no email!');
          return;
        }

        mandrill('/messages/send', {
          message: {
            to: [{email: this.email, name: this.username}],
            from_email: config.email.fromAddress,
            subject: "[Cascade] Your receipt",
            text: "Hi " + this.username + ", your new balance is " + this.balance.toFixed(2)
          }
        }, function(err) {
          if (err) {
            log.error(err);
          }
        });
      }
    }
  });
};
