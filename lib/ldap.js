
/**
 * Module dependencies
 */

var _         = require('underscore');
var co        = require('co');
var config    = require('./config.js');
var ad        = require('activedirectory');
var log       = require('logule').init(module, "ldap");
var thunkify  = require('thunkify');
var util      = require('util');

/**
 * Thunks
 * @see https://github.com/visionmedia/node-thunkify
 */

var find      = thunkify(ad.find);

/**
 * Initialize ldap
 *
 * @constructor
 */

function ldap() {

  /**
   * init and configure activedirectory
   *
   * ldapsearch -h <host> -p <port> -x -b "<base dn>"
   *
   * @type {activeDirectory}
   */

  this.activeDirectory = new ad({
    url     : util.format('ldap://%s/', config.ldap.host),
    baseDN  : config.ldap.basedn
  });

  // ..

  log.info('init');

}

/**
 * Find user associated with `device` serial number
 *
 * @param device serial number
 */

ldap.prototype.findUserForDevice = function(device) {
  co(function *() {
    var success = false;


    var user = yield find(util.format('usbSerial=%s', device));
    if (user) {

    }

    return success;
  })();
};

/**
 * Expose `ldap`
 * @type {ldap}
 */

module.exports = ldap;
