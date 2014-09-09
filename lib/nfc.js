
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

  /**
   * nfc instance
   * @type {NFC}
   * @private
   */

  this._nfc = new NFC();

  /**
   * NFC reader spews ~100mps, use this for rate limiting
   *
   * @type {boolean}
   */

  this._nfcTagActive = false;

  /**
   * nfc scanning?
   * @type {boolean}
   */

  this._running = false;
}

/**
 * Inherit event.emitter
 */

util.inherits(nfc, emitter);

/**
 * start nfc, set up handlers
 */

nfc.prototype.start = function() {
  if (this.running) {
    return;
  }

  log.info('starting nfc');


  this.running = true;
  this._nfc.start();
  setupInitHandlers();

};

/**
 * setup init handlers
 */
function setupInitHandlers() {
  var self = this;

  /**
   * add nfc detection handlers
   * @see https://github.com/camme/node-nfc
   */

  this._nfc.on('uid', function(uid) {
    self._handleNfc(uid, uid.toString('hex'));
  });
}

/**
 * stop nfc, remove handlers
 */

nfc.prototype.stop = function() {
  if (!this.running) {
    return;
  }

  log.info('stopping nfc');

  this.running = false;
  this._nfc.stop();
  this._nfc.removeAllListeners();
};

/**
 *
 * @param type
 * @param id
 * @private
 */

nfc.prototype._handleNfc = function(type, id) {
  var self = this;

  if (!this._nfcTagActive) {
    this._nfcTagActive = true;
    this.emit(type, id);

    /**
     * Reset nfc tag status
     * Ignore messages for `nfcTimeout` ms
     */

    setTimeout(function resetNfcActive() {
      self._nfcTagActive = false;
    }, config.nfcTimeout);
  }
};

/**
 * Expose `nfc`
 * @type {nfc}
 */

module.exports = new nfc();
