
/**
 * Module dependencies
 */

var config  = require('./config.js');
var gpio    = require('rpi-gpio');
var ldap    = require('./ldap.js');
var log     = require('logule').init(module, 'cascade');
var model   = require('./model.js');
var nfc     = require('nfc').nfc;
var usb     = require('usb-detection');

/**
 * nfc instance
 * @type {nfc}
 */

var n     = new nfc();

/**
 * Initialize Cascade
 *
 * @constructor
 */

function Cascade() {

  /**
   * self
   * @type {Cascade}
   */

  var self = this;

  /**
   * NFC reader spews ~100mps, do we currently see a tag? if so, throw event, ignore until not active
   *
   * @type {boolean}
   * @see
   */

  self.nfcTagActive = false;

  /**
   * usb detection handlers
   * @see https://github.com/KABA-CCEAC/node-usb-detection
   */

  usb.on('add', self._handleAddUsbDevice);
  usb.on('remove', self._handleRemoveDevice);

  /**
   * nfc detection handlers
   * @see https://github.com/camme/node-nfc
   */

  n.on('ats', self._handleNfcAts);
  n.on('uid', self._handleNfcUid.bind(self));

  // ..

  n.start();

  /**
   * setup rpi pins
   *
   * GPIO 21 = change slot relay
   * GPIO 12 = status light
   *
   * @see https://github.com/JamesBarwell/rpi-gpio.js
   */

  // change slot relay

//  gpio.setup(config.rpi.relayPin, gpio.DIR_OUT, function(err) {
//    if (err) throw err;
//    gpio.write(config.rpi.relayPin, true, function(err) {
//      if (err) throw err;
//    });
//  });
//
//  // front status led
//
//  gpio.setup(config.rpi.ledPin, gpio.DIR_OUT, function(err) {
//    if (err) throw err;
//    gpio.write(config.rpi.ledPin, true, function(err) {
//      if (err) throw err;
//    });
//  });

  /**
   * Reset nfc tag status
   * Ignore messages every ~second
   */

  setInterval(function resetNfcActive() {
    self.nfcTagActive = false;
  }, 500);

  // ..

  log.info('init!');
}

// ------------------------------------------------------------------------------------
// NFC
// ------------------------------------------------------------------------------------

/**
 *
 * @param ats
 * @private
 */

Cascade.prototype._handleNfcAts = function(ats) {
  //stub
};

/**
 *
 * @param _uid
 * @private
 */

Cascade.prototype._handleNfcUid = function(_uid) {

  console.log(_uid);

  if (!this.nfcTagActive) {
    this.nfcTagActive = true;

    var uid = _uid.toString('hex')
    ldap.findUserForNFCID(uid, function foundUser(err, res) {
      if (err) throw err;
      if (res.nfcID == uid) {
        cycleSlot(250);
      }
    });
  }
}

// ------------------------------------------------------------------------------------
// USB
// ------------------------------------------------------------------------------------

/**
 * Handle usb-detection `add` device event
 *
 * @param err
 * @param devices
 * @private
 */

Cascade.prototype._handleAddUsbDevice = function(device) {
  ldap.findUserForUSBSerial(device.serialNumber, function(err, res) {
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
  gpio.write(config.rpi.relayPin, false, function(err) {
    if (err) throw err;
    setTimeout(function() {
      gpio.write(config.rpi.relayPin, true, function(err) {
        if (err) throw err;
      });
    }, delay)
  });
}

/**
 * Expose `Cascade`
 * @type {Cascade}
 */

module.exports = Cascade;

/**
 * Init & return new Cascade instance
 * @type {Function}
 */

module.exports.init = (function() {
  return new Cascade();
});