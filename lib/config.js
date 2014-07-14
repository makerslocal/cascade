
/**
 * Module dependencies
 */

var util = require('util');

/**
 * Configuration options
 */

module.exports = {
  relayCycleTime : 250, //milliseconds @see cascade.js :: cycleSlot()
  http : {
    enabled : true,
    port    : 80
  },
  ldap : {
    basedn  : "dc=makerslocal,dc=org",
    host    : "10.56.0.8"
  },
  modelPath : util.format('%s/models/', __dirname),
  sqlite : {
    db      : '/Users/dusty/Downloads/cash_db'
  }
};
