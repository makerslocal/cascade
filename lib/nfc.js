
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
  }, 500);

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
 * ..
 */

util.inherits(nfc, emitter);


/**
 * Expose `usb`
 * @type {usb}
 */

module.exports = new nfc();
