
/**
 * Module dependencies
 */

var emitter   = require('events').EventEmitter;
var log       = require('logule').init(module, 'usb');
var udev      = require('udev');
var util      = require('util');

/**
 * udev monitor
 */

var monitor = udev.monitor();

/**
 * Initialize udev
 *
 * @constructor
 */

function usb() {

  var self = this;

  // ..

  log.info('init');
}

/**
 * ..
 */

util.inherits(usb, emitter);

usb.prototype.start = function() {

  /**
   * usb detection handlers
   * @see https://github.com/KABA-CCEAC/node-usb-detection
   */

  monitor.on('add', self._handleUsbAdd.bind(self));
};

usb.prototype.stop = function() {
  monitor.removeEventListener('add');
};

/**
 *
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
