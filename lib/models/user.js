
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
  }, {
    instanceMethods: {
      // ..
    }
  });
};
