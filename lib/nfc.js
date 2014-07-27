
/**
 * Module dependencies
 */

var emitter   = require('events').EventEmitter;
var log       = require('logule').init(module, "nfc");
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
   * NFC reader spews ~100mps, do we currently see a tag? if so, throw event, ignore until not active
   *
   * @type {boolean}
   * @see
   */

  self.nfcTagActive = false;

  /**
   * Reset nfc tag status
   * Ignore messages every ~second
   */

  setInterval(function resetNfcActive() {
    self.nfcTagActive = false;
  }, 2000);

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
  if (!this.nfcTagActive) {
    this.nfcTagActive = true;
    this.emit('ats', ats.toString('hex'));
  }
};

/**
 *
 * @param uid
 * @private
 */

nfc.prototype._handleNfcUid = function(uid) {
  if (!this.nfcTagActive) {
    this.nfcTagActive = true;
    this.emit('uid', uid.toString('hex'));
  }
};

/**
 * Expose `usb`
 * @type {usb}
 */

module.exports = new nfc();
