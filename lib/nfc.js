
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

  n.on('ats', function(ats) {
    self._handleNfc(ats, ats.toString('hex'));
  });

  n.on('uid', function(uid) {
    self._handleNfc(uid, uid.toString('hex'));
  });

  // ..

  log.info('init');
}

/**
 * Inherit event.emitter
 */

util.inherits(nfc, emitter);

/**
 *
 * @param type
 * @param id
 * @private
 */

nfc.prototype._handleNfc = function(type, id) {
  var self = this;

  if (!this.nfcTagActive) {
    this.nfcTagActive = true;
    this.emit(type, id);

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
 * Expose `nfc`
 * @type {nfc}
 */

module.exports = new nfc();
