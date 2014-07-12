
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
  dumpCoins();
/*  co(function * () {
    var error = yield write(7, true);
    if (error) throw error;
  })();*/
};

/**
 * Handle usb-detection `remove` device event
 *
 * @param err
 * @param devices
 * @private
 */

Cascade.prototype._handleRemoveDevice = function(device) {
/*  co(function * () {
    var error = yield write(7, false);
    if (error) throw error;
  })();*/
};

// ------------------------------------------------------------------------------------
// RPI handlers
// ------------------------------------------------------------------------------------

function write(channel, value) {
  return function(fn) {
    gpio.write(channel, value, fn);
  }
}

function dumpCoins() {
  co(function * () {
    var error = yield write(7, true);
    if (!error) {
      yield wait(2500);
      error = yield write(7, false);
      if (error) throw error;
    } else {
      throw error;
    }
  })();
}

/**
 * Expose `Cascade`
 * @type {Cascade}
 */

module.exports = Cascade;
