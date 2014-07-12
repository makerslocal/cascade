
/**
 * Module dependencies
 */

var co        = require('co');
var config    = require('./config.js')
var gpio      = require('rpi-gpio');
var log       = require('logule').init(module, 'cascade');
var model     = require('./model.js');
var thunkify  = require('thunkify');
var usb       = require('usb-detection');
var wait      = require('co-wait');

/**
 * Thunks
 * @see https://github.com/visionmedia/node-thunkify
 */

var write     = thunkify(gpio.write);

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

  /**
   * setup rpi pins
   *
   * GPIO 7 = change slot
   * GPIO X = status light
   *
   * @see https://github.com/JamesBarwell/rpi-gpio.js
   */

  gpio.setup(7, gpio.DIR_OUT);

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
  cycleSlot(config.relayCycleTime);
};

/**
 * Handle usb-detection `remove` device event
 *
 * @param err
 * @param devices
 * @private
 */

Cascade.prototype._handleRemoveDevice = function(device) {
 // ..
};

// ------------------------------------------------------------------------------------
// RPI helpers
// ------------------------------------------------------------------------------------

/**
 * Set pin high and after `delay` set pin low
 * @param delay in milliseconds
 */

function cycleSlot(delay) {
  co(function *() {
    var error;
    // ..
    if (error = yield write(7, true)) {
      throw error;
    } else {
      yield wait(delay);
      if (error = yield write(7, false)) {
        throw error;
      }
    }
  })();
}

///**
// * Write `value` to channel
// * @param channel
// * @param value
// * @returns {Function}
// */
//
//function write(channel, value) {
//  return function(fn) {
//    gpio.write(channel, value, fn);
//  }
//}

/**
 * Expose `Cascade`
 * @type {Cascade}
 */

module.exports = Cascade;
