
/**
 * Module dependencies
 */

var co        = require('co');
var gpio      = require('rpi-gpio');
var log       = require('logule').init(module, 'cascade');
var model     = require('./model.js');
var thunkify  = require('thunkify');
var usb       = require('usb-detection');
var wait      = require('co-wait');

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
  log.info('add device', device);
  co(dumpCoins);
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


function write(channel, value) {
  return function(fn) {
    gpio.write(channel, value, fn);
  }
}

function *dumpCoins() {
  var successfulOpen = write(7, true) ? true : false;
  if (successfulOpen) {
    yield wait(250);
    var successfulClose = write(7, false) ? true : false;
    if (successfulClose) {

    } else {
      log.error("CLOSE FAILED");
    }
  } else {
    log.error("OPEN FAILED");
  }
}

/**
 * Expose `Cascade`
 * @type {Cascade}
 */

module.exports = Cascade;