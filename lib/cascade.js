
/**
 * Module dependencies
 */

var log   = require('logule').init(module, 'cascade');
var model = require('./model.js')
var usb   = require('usb-detection');

/**
 * Initialize Cascade
 *
 * @constructor
 */

function Cascade() {

  /**
   * usb detection handlers
   * @see https://github.com/KABA-CCEAC/node-usb-detection
   */

  usb.on('add', this._handleAddDevice);
  usb.on('remove', this._handleRemoveDevice);

  // ..

  log.info('running!');
}

/**
 * Handle usb-detection `add` device event
 *
 * @param err
 * @param devices
 * @private
 */

Cascade.prototype._handleAddDevice = function(device) {
  log.info('add device', err);
};

/**
 * Handle usb-detection `remove` device event
 *
 * @param err
 * @param devices
 * @private
 */

Cascade.prototype._handleRemoveDevice = function(device) {
  log.info('remove device');
};

/**
 * Expose `Cascade`
 * @type {Cascade}
 */

module.exports = Cascade;