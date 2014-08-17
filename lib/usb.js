
/**
 * Module dependencies
 */

var emitter   = require('events').EventEmitter;
var log       = require('logule').init(module, 'usb');
var udev      = require('udev');
var util      = require('util');

/**
 * Initialize usb
 *
 * @constructor
 */

function usb() {

  /**
   * udev monitor
   * @private
   */

  this._monitor = undefined;

  /**
   * udev monitoring?
   * @type {boolean}
   * @private
   */

  this._running = false;
}

/**
 * ..
 */

util.inherits(usb, emitter);

/**
 * start usb, add handlers
 */

usb.prototype.start = function() {

  if (this._running) {
    return;
  }

  log.info('starting usb')

  this._running = true;

  this._monitor = udev.monitor();

  /**
   * usb detection handlers
   * @see https://github.com/KABA-CCEAC/node-usb-detection
   */

  this._monitor.on('add', self._handleUsbAdd.bind(self));
};

/**
 * stop usb, remove handlers
 */

usb.prototype.stop = function() {

  if (!this._running) {
    return;
  }

  this._running = false;

  log.info('stopping usb')

  this._monitor.close();
};

/**
 * handle udev add
 * @param device
 * @private
 */

usb.prototype._handleUsbAdd = function(device) {
  if(device.DEVTYPE == 'usb_device') {
    var serial = device.ID_SERIAL_SHORT;
    this.emit('add', serial);
  }
};

/**
 * Expose `usb`
 * @type {usb}
 */

module.exports = new usb();
