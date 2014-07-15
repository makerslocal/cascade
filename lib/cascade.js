
/**
 * Module dependencies
 */

var _         = require('underscore');
var co        = require('co');
var config    = require('./config.js');
var gpio      = require('rpi-gpio');
var ldap      = require('./ldap.js');
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
   * GPIO 22 = change slot
   * GPIO X = status light
   *
   * @see https://github.com/JamesBarwell/rpi-gpio.js
   */

  gpio.setup(16, gpio.DIR_OUT, function(err) {
    if (err) throw err;
    gpio.write(16, true, function(err) {
      if (err) throw err;
    });
  });

  // ..

  log.info('init!');
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
  ldap.findUserForDevice(device.serialNumber, function(err, res) {
    if (err) throw err;
    if (res.usbSerial == device.serialNumber) {
      cycleSlot(250);
    }
  });
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
    if (error = yield write(16, false)) {
      throw error;
    } else {
      yield wait(delay);
      if (error = yield write(16, true)) {
        throw error;
      }
    }
  })();
}

/**
 * Expose `Cascade`
 * @type {Cascade}
 */

module.exports = Cascade;
