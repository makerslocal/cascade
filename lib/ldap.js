
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

  this.connected = false;

  /**
   * ldap client
   */

  this.client = ldapjs.createClient({
    url: util.format('ldap://%s/', config.ldap.host),
    connectTimeout: 5
  });

  this.client.on('connect', function(socket) {
   this.connected = true;
  });

  this.client.on('connectTimeout', function() {
    console.log("connect timeout");
  });

  this.client.on('connectError', function(err) {
    console.log(err);
  });

  this.client.on('setupError', function(err) {
    console.log(err);
  });


  // ..

  log.info('init');
}

/**
 * Find user for usbSerial `id` or nfcID `id`
 *
 * @param device
 * @param fn
 */

ldap.prototype.findUserForDevice = function(id, fn) {
  this._query(util.format('(|(usbSerial=%s)(nfcID=%s))', id, id), fn);
};

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

ldap.prototype._query = function(filter, fn) {
  var opts = {
    filter: filter,
    scope: 'one',
    timeLimit: 2
  };
  var entries = [];

  this.client.search("ou=people," + config.ldap.basedn, opts, function (err, res) {
    if (err) fn(err);
    res.on('searchEntry', function (entry) {
      entries.push(entry.object);
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
    });
    res.on('end', function(result) {
      console.log('status=%d, num_entries=%d', result.status, entries.length);
      console.log('entries => %j', entries);
      fn(false, entries[0]);
    });
  });
};

/**
 * Expose `ldap`
 * @type {ldap}
 */

module.exports = new ldap();
