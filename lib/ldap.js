
/**
 * Module dependencies
 */

var _       = require('underscore');
var config  = require('./config.js');
var ad      = require('activedirectory');
var log     = require('logule').init(module, "ldap");
var util    = require('util');

/**
 * Initialize and configure LDAP
 *
 *  ldapsearch -h <host> -p <port> -x -b "<base dn>"
 *
 * @type {ad}
 */

var ldap = new ad({
  url     : util.format('ldap://%s/', config.ldap.host),
  baseDN  : config.ldap.basedn
});

/**
 * Expose findUserForDevice
 */

/**
 * Find user for usb serial `device`
 *
 * @param device usb serial
 */

module.exports.findUserForDevice = function(device) {
  var query = util.format('usbSerial=%s', device);

  console.log(query);

  ldap.find(query, function(error, result) {

    if (error) throw error;

    console.log(result);
  });
};
