
/**
 * Module dependencies
 */

var util = require('util');

/**
 * Configuration options
 */

module.exports = {
  relayCycleTime : 100, //milliseconds @see cascade.js :: cycleSlot()
  http : {
    enabled   : true,
    port      : 80
  },
  ldap : {
    basedn    : "dc=makerslocal,dc=org",
    host      : "10.56.0.8"
  },
  modelPath   : util.format('%s/models/', __dirname),
  nfcPoll     : 500, //milliseconds to ignore nfc requests between active scans
  rpi : {
    ledPin    : 12,
    relayPin  : 11
  },
  sqlite : {
    db        : '/home/pi/cascade/db/cash_db'
  }
};
