
/**
 * Module dependencies
 */

var events    = require('events');
var log       = require('logule').init(module, 'nfc');
var nfcd      = require('nfc').nfc;
var util      = require('util');

/**
 * Detect NFC events on `libnfc` and publish to all subscribers
 *
 * @constructor
 */

function nfc() {

  /**
   * instance for binding
   * @type {nfc}
   */

  var self = this;

  /**
   * NFC reader spews ~100mps, do we currently see a tag? if so, throw event, ignore until not active
   *
   * @type {boolean}
   * @see
   */

  this.active = false;

  /**
   * nfc instance
   * @type {nfcd}
   */

  this.n = new nfcd();

  /**
   * nfc detection handlers
   * @see https://github.com/camme/node-nfc
   */

  this.n.on('uid', self._handleUid.bind(self));

  /**
   * start nfc
   */

  this.n.start();

  /**
   * Ignore messages every ~second
   */

  setInterval(function() {
    self.active = false;
  }, 1000);

  // ..

  log.info('init!');
}

/**
 * Inherit from `Emitter.prototype`.
 */

util.inherits(nfc, events.EventEmitter);

/**
 * Handle nfc `uid` event
 *
 * @param uid
 * @private
 */

nfc.prototype._handleUid = function(uid) {
  if (!this.active) {
    this.active = true;
    this.emit('uid', uid);
  }
};

/**
 * Expose `nfc`
 * @type {nfc}
 */

module.exports = (function() {
  return new nfc();
})();
