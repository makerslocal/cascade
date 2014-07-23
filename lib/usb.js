
/**
 * Module dependencies
 */

var config    = require('./config.js');
var emitter   = require('events').EventEmitter;
var log       = require('logule').init(module, "usb");
var udev      = require('udev');
var util      = require('util');

/**
 * udev monitor
 */

var monitor = udev.monitor();

/**
 * ldap
 *
 * @constructor
 */

function usb() {

  var self = this;

  /**
   * usb detection handlers
   * @see https://github.com/KABA-CCEAC/node-usb-detection
   */

  monitor.on('add', function (device) {
    if(device.DEVTYPE == 'usb_device') {
      var serial = device.ID_SERIAL_SHORT;
      self.emit(serial);
    }
  });

  // ..

  log.info('init');
}

/**
 * ..
 */

util.inherits(usb, emitter);


/**
 * Expose `usb`
 * @type {usb}
 */

module.exports = new usb();
