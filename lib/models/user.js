
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
       *
       * @param amount
       * @returns {boolean}
       */
      withdraw : function(amount) {
        if (this.balance < amount) {
          return false;
        }

        this.decrement('balance', { by: amount });

      },
      /**
       *
       */
      notifyBalance : function() {
        if (!this.email) {
          log.error(this.username + ' has no email!');
          return;
        }

        mandrill('/messages/send', {
          message: {
            to: [{email: user.email, name: user.username}],
            from_email: config.email.fromAddress,
            subject: "[Cascade] Receipt",
            text: "Hi " + user.username + ", your current balance is: " + user.balance.toFixed(2)
          }
        }, function(err) {
          if (err) {
            log.error(err);
          }
          // ..
        });
      }
      // ..
    }
  });
};
