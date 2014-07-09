
/**
 * Module dependencies
 */

var gpio  = require('rpi-gpio');
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

// ------------------------------------------------------------------------------------
// USB handlers
// ------------------------------------------------------------------------------------

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

// ------------------------------------------------------------------------------------
// RPI handlers
// ------------------------------------------------------------------------------------

function testWrite() {
  gpio.write(7, true, function(err) {
    if (err) {
      throw err;
    }
    setTimeout(function() {
      gpio.write(7, false, function(err) {
        if (err) {
          throw err;
        }
      });
    }, 250);
  });
}

/**
 * Expose `Cascade`
 * @type {Cascade}
 */

module.exports = Cascade;