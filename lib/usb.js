
/**
 * Module dependencies.
 */

var usb = require('usb-detection');



module.exports = (function() {
  /**
   * usb insert stub
   */

  usb.on('add', function(err, device) {

  });

  /**
   * usb remove stub
   */

  usb.on('remove', function(err, device) {

  });

  return usb;
}());