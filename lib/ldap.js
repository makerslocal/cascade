
/**
 * Module dependencies
 */

var config    = require('./config.js');
var ldapjs    = require('ldapjs');
var log       = require('logule').init(module, 'ldap');
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

  this.client = undefined;

  /**
   * ldap connected?
   * @type {boolean}
   */

  this.connected = false;

  /**
   * initial connect
   */

  this._connect();

  // ..

  log.info('init');
}

/**
 *
 * @private
 */

ldap.prototype._connect = function() {
  log.info('trying to connect..');
  this.client = ldapjs.createClient({
    url: util.format('ldap://%s/', config.ldap.host),
    connectTimeout: config.ldap.connectTimeout
  });
  this._setupEventListeners();
};

/**
 *
 * @private
 */

ldap.prototype._reconnect = function() {
  var self = this;

  log.info('reconnecting in 10s..');

  setTimeout(function() {
    self._connect();
  }, config.ldap.reconnectTimeout);
};

/**
 *
 * @private
 */

ldap.prototype._setupEventListeners = function() {
  this.client.on('connect', this._handleConnect.bind(this));
  this.client.on('connectError', this._handleConnectError.bind(this));
  this.client.on('connectTimeout', this._handleConnectTimeout.bind(this));
};

/**
 * connect success, set connected true
 *
 * @param socket
 * @private
 */

ldap.prototype._handleConnect = function(socket) {
  log.info('connected');
  this.connected = true;
};

/**
 * connect timed out
 *
 * @private
 */

ldap.prototype._handleConnectTimeout = function() {
  log.error('connection timed out');
  this._reconnect();
};

/**
 * connect failed
 *
 * @private
 */

ldap.prototype._handleConnectError = function(error) {
  log.error('error connecting');
  this._reconnect();
};

/**
 * authenticate
 *
 * @param user
 * @param password
 */

ldap.prototype.authenticate = function(user, password, fn) {
  var dn = util.format('uid=%s,' + config.ldap.basedn, user);
  this.client.bind(dn, password, function(err) {
    if (err) {
      return fn(err, false);
    }
    fn(null, true);
  });
};

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
  if (!this.connected) {
    log.error('Not connected');
    return fn(false, null);
  }

  var opts = {
    filter: filter,
    scope: 'one',
    timeLimit: 2
  };

  var user = null;

  this.client.search(config.ldap.basedn, opts, function (err, res) {
    if (err) fn(err);
    res.on('searchEntry', function (entry) {
      user = entry.object;
    });
    res.on('error', function(err) {
      console.error('error: ' + err.message);
    });
    res.on('end', function(result) {
      fn(false, user);
    });
  });
};

/**
 * Expose `ldap`
 * @type {ldap}
 */

module.exports = new ldap();
