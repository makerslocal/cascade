
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
  log.info('init');
}

/**
 *
 * @param device
 * @param fn
 */

ldap.prototype.findUserForDevice = function(device, fn) {
  var query = util.format('usbSerial=%s', device);

  var client = ldapjs.createClient({
    url: util.format('ldap://%s/', config.ldap.host)
  });

  var opts = {
    filter: query,
    scope: 'sub'
  };

  client.search(config.ldap.basedn, opts, function (err, res) {
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
