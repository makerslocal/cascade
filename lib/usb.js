module.exports = (function() {
  var usb = require('usb-detection');

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