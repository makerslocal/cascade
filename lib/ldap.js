
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
 *  ldapsearch -h 10.56.0.8 -p 389 -x -b "dc=makerslocal,dc=org"
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

    if (_.size(result['other']) > 0) {
      return true;
    } else {
      return false;
    }
  });
};
