
/**
 * Module dependencies
 */

var config    = require('./config.js');
var emitter   = require('events').EventEmitter;
var log       = require('logule').init(module, 'nfc');
var NFC       = require('nfc').nfc;
var util      = require('util');

/**
 * nfc instance
 * @type {nfc}
 */

var n = new NFC();

/**
 * ldap
 *
 * @constructor
 */

function nfc() {

  var self = this;

  /**
   * NFC reader spews ~100mps, use this for rate limiting
   *
   * @type {boolean}
   */

  self.nfcTagActive = false;

  // ..

  n.start();

  /**
   * nfc detection handlers
   * @see https://github.com/camme/node-nfc
   */

  n.on('ats', self._handleNfcAts.bind(self));
  n.on('uid', self._handleNfcUid.bind(self));

  // ..

  log.info('init');
}

/**
 * Inherit event.emitter
 */

util.inherits(nfc, emitter);

/**
 *
 * @param ats
 * @private
 */

nfc.prototype._handleNfcAts = function(ats) {
  var self = this;

  if (!this.nfcTagActive) {
    this.nfcTagActive = true;
    this.emit('ats', ats.toString('hex'));

    /**
     * Reset nfc tag status
     * Ignore messages for `nfcTimeout` ms
     */

    setTimeout(function resetNfcActive() {
      self.nfcTagActive = false;
    }, config.nfcTimeout);
  }
};

/**
 *
 * @param uid
 * @private
 */

nfc.prototype._handleNfcUid = function(uid) {
  var self = this;

  if (!this.nfcTagActive) {
    this.nfcTagActive = true;
    this.emit('uid', uid.toString('hex'));

    /**
     * Reset nfc tag status
     * Ignore messages for `nfcTimeout` ms
     */

    setTimeout(function resetNfcActive() {
      self.nfcTagActive = false;
    }, config.nfcTimeout);
  }
};

/**
 * Expose `usb`
 * @type {usb}
 */

module.exports = new nfc();
