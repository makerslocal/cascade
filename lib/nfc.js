
/**
 * Module dependencies
 */

var config    = require('./config.js');
var emitter   = require('events').EventEmitter;
var log       = require('logule').init(module, 'nfc');
var NFC       = require('nfc').nfc;
var util      = require('util');

/**
 * nfc
 *
 * @constructor
 */

function nfc() {

  var self = this;

  /**
   * nfc instance
   * @type {NFC}
   * @private
   */

  self._nfc = new NFC();

  /**
   * NFC reader spews ~100mps, use this for rate limiting
   *
   * @type {boolean}
   */

  self.nfcTagActive = false;

  /**
   * nfc scanning?
   * @type {boolean}
   */

  self.running = false;

  // ..

  log.info('init');
}

/**
 * Inherit event.emitter
 */

util.inherits(nfc, emitter);

/**
 *
 */

nfc.prototype.start = function() {
  var self = this;

  if (!self.running) {
    self._nfc.start();

    /**
     * add nfc detection handlers
     * @see https://github.com/camme/node-nfc
     */

//    this._nfc.on('ats', function(ats) {
//      self._handleNfc(ats, ats.toString('hex'));
//    });

    self._nfc.on('uid', function(uid) {
      self._handleNfc(uid, uid.toString('hex'));
    });
  }
};

/**
 *
 */

nfc.prototype.stop = function() {
  var self = this;

 if (self.running) {
   self._nfc.stop();
   self._nfc.removeAllListeners();
 }
};

/**
 *
 * @param type
 * @param id
 * @private
 */

nfc.prototype._handleNfc = function(type, id) {
  var self = this;

  if (!self.nfcTagActive) {
    self.nfcTagActive = true;
    self.emit(type, id);

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
