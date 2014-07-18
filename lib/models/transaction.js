
/**
 * Module dependencies
 */

var log = require('logule').init(module, 'transaction')

/**
 * Transaction model
 *
 * @param sequelize
 * @param DataTypes
 * @returns {*}
 */

module.exports = function(sequelize, DataTypes) {

  log.info('importing..');

  return sequelize.define('Transactions', {
    id        : DataTypes.INTEGER,
    timestamp : DataTypes.DATE,
    usd       : DataTypes.FLOAT,
    user_id   : DataTypes.INTEGER
  }, {
    instanceMethods: {
      // ..
    }
  });
};
