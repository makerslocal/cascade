
/**
 * Module dependencies
 */

var log = require('logule').init(module, 'user')

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

      }
      // ..
    }
  });
};
