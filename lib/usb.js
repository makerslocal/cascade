
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
   */

  this.monitor = undefined;

  /**
   * udev monitoring?
   * @type {boolean}
   */

  this.running = false;
}

/**
 * ..
 */

util.inherits(usb, emitter);

/**
 * start usb, add handlers
 */

usb.prototype.start = function() {

  if (this.running) {
    return;
  }

  log.info('starting usb')

  this.running = true;

  this.monitor = udev.monitor();

  /**
   * usb detection handlers
   * @see https://github.com/KABA-CCEAC/node-usb-detection
   */

  this.monitor.on('add', self._handleUsbAdd.bind(self));
};

/**
 * stop usb, remove handlers
 */

usb.prototype.stop = function() {

  if (!this.running) {
    return;
  }

  this.running = false;

  log.info('stopping usb')

  this.monitor.close();
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
