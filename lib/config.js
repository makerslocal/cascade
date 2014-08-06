
/**
 * Module dependencies
 */

var util = require('util');

/**
 * Configuration options
 */

module.exports = {
  relayCycleTime      : 100, //milliseconds @see cascade.js :: cycleSlot()
  http    : {
    enabled           : true,
    port              : 80
  },
  ldap    : {
    basedn            : "ou=people,dc=makerslocal,dc=org",
    host              : "10.56.0.8",
    reconnectTimeout  : 10000
  },
  mandrillApiKey      : '',
  modelPath           : util.format('%s/models/', __dirname),
  nfc     : {
    enabled           : true,
    timeoutThrottle   : 2000
  },
  nfcTimeout          : 2000, //milliseconds to ignore nfc requests between active scans
  rpi     : {
    ledPin            : 12,
    relayPin          : 11
  },
  sqlite  : {
    db                : '/home/pi/cascade/db/cash_db'
  },
  usb     : {
    enabed            : true
  }
};
