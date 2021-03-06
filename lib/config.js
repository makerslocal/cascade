
/**
 * Module dependencies
 */

var util = require('util');

/**
 * Configuration options
 */

module.exports = {
  relayCycleTime      : 100, //milliseconds @see cascade.js :: cycleSlot()
  ledBlinkTime        : 500, //milliseconds @see cascade.js :: blinkLED()
  email   : {
    apiKey            : '',
    fromAddress       : 'no-reply@makerslocal.org'
  },
  http    : {
    enabled           : true,
    port              : 80
  },
  ldap    : {
    basedn            : 'ou=people,dc=makerslocal,dc=org',
    host              : '10.56.0.8',
    connectTimeout    : 10000, //ms
    operationTimeout  : 2000, //ms
    reconnectTimeout  : 10000 //ms
  },
  mandrillApiKey      : '',
  modelPath           : util.format('%s/models/', __dirname),
  nfc     : {
    enabled           : true,
    timeoutThrottle   : 2000 //ms
  },
  nfcTimeout          : 2000, //ms to ignore nfc requests between active scans
  rpi     : {
    ledPin            : 12,
    relayPin          : 11
  },
  sqlite  : {
    db                : '/Users/dusty/Workspace/dusty/cascade/db/cash_db'
  },
  usb     : {
    enabled            : true
  }
};
