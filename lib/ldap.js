
/**
 * Module dependencies
 */

var config    = require('./config.js');
var ldapjs    = require('ldapjs');
var log       = require('logule').init(module, "ldap");
var util      = require('util');

/**
 * Initialize ldap
 *
 * @constructor
 */

function ldap() {

  /**
   * ldap client
   */

  this.client = ldapjs.createClient({
    url: util.format('ldap://%s/', config.ldap.host)
  });

  // ..

  log.info('init');
}

/**
 * Find user for usbSerial `device`
 *
 * @param device
 * @param fn
 */

ldap.prototype.findUserForUSBSerial = function(serial, fn) {
  this._query(util.format('usbSerial=%s', serial), fn);
};

/**
 * Find user for nfcID `device`
 *
 * @param device
 * @param fn
 */

ldap.prototype.findUserForNFCID = function(id, fn) {
  this._query(util.format('nfcID=%s', id), fn);
};

/**
 * Generic LDAP query
 *
 * @param device
 * @param fn
 */

ldap.prototype._query = function(query, fn) {
  var opts = {
    filter: query,
    scope: 'sub'
  };

  console.log(query);

  this.client.search(config.ldap.basedn, opts, function (err, res) {
    if (err) fn(err);
    res.on('searchEntry', function (entry) {
      fn(false, entry.object);
    });
  });
};

/**
 * Expose `ldap`
 * @type {ldap}
 */

module.exports = new ldap();
