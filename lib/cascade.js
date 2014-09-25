var _       = require('underscore');
var config  = require('./config.js');
var gpio    = require('rpi-gpio');
var log     = require('logule').init(module, 'cascade');
var model   = require('./model.js');
var nfc     = require('./nfc.js');
var usb     = require('./usb.js');
var user    = require('./user.js');

// ------------------------------------------------------------------------------------
// Cascade
// ------------------------------------------------------------------------------------

function Cascade() {

  /**
   * Instance
   * @type {Cascade}
   */

  var self = this;

  /**
   * gpio instance
   * @type {gpio}
   */

  this._gpio = undefined;

  /**
   * setup rpi pins
   *
   * GPIO 21 = change slot relay
   * GPIO 12 = status light
   *
   * @see https://github.com/JamesBarwell/rpi-gpio.js
   */

  var initPins = [
    config.rpi.relayPin,
    config.rpi.ledPin
  ];

  _.each(initPins, function(pin) {
    var gpio = self._gpio;

    log.info(pin);

    gpio.setup(pin, gpio.DIR_OUT, function(err) {
      if (err) {
        throw err;
      }
      gpio.write(pin, true, function(err) {
        if (err) {
          throw err;
        }
      });
    });
  });

  /**
   * Machine's User model instance
   * @type {User|undefined}
   */

  this.machine = undefined;

  // ..

  this.init();
}

// ------------------------------------------------------------------------------------
// Initers
// ------------------------------------------------------------------------------------

/**
 * init cascade
 */

Cascade.prototype.init = function() {
  log.info('init');
  this.initMachine()
  this.initNfc();
  this.initUsb();
};


/**
 * init machine user
 */

Cascade.prototype.initMachine = function() {
  var self = this;
  var User = model.User;

  User.find({
    where: ['id = ? and username = ?', '1', 'Machine'],
    attributes: ['balance']
  }).error(function(err) {
    //cant get machine user, bail out
    throw err;
  }).success(function(machine) {
    self.machine = machine;
  });
};

/**
 * init nfc detection handlers
 */

Cascade.prototype.initNfc = function() {
  nfc.on('uid', this._handleNfcUid.bind(this));
};

/**
 * init usb detection handlers
 */

Cascade.prototype.initUsb = function() {
  usb.on('add', this._handleAddUsbDevice.bind(this));
};

// ------------------------------------------------------------------------------------
// Withdrawal
// ------------------------------------------------------------------------------------

/**
 * find user for device event
 *
 * @param id device either usb serial or nfs uid/ats
 */

Cascade.prototype.findUserAndWithdraw = function(id) {
  var amount = 0.50;
  var self = this;

  /**
   * does machine have funds?
   */

  if (!machine || machine.balance < amount) {
    blinkLED(3*config.ledBlinkTime);
    log.error("machine empty");
    return;
  }

  /**
   * get user for device
   */

  user.findUserForDevice(id, function(error, user) {
    if (error) {
      //failed
      return;
    }

    if (user === null) {
      log.error(user + ' does not have a cascade account');

      /**
       * blink LED to show no user account
       */

      blinkLED(config.ledBlinkTime);
      return;
    }

    /**
     * does user have funds?
     */

    if (user.balance < amount) {
      log.error('user does not have enough funds');

      /**
       * blink LED three times to show no user funds
       */

      blinkLED(config.ledBlinkTime);
      setTimeout(function() {blinkLED(config.ledBlinkTime);}, config.ledBlinkTime*2*1);
      setTimeout(function() {blinkLED(config.ledBlinkTime);}, config.ledBlinkTime*2*2);

      return;
    }

    /**
     * cycle relay and drop coins
     */

    cycleSlot(config.relayCycleTime);

    /**
     * update machine account
     */

    self.machine.withdraw(amount);

    /**
     * update user balance
     */

    user.withdraw(amount);

    /**
     * notify user
     */

    user.notifyBalance();
  });
};

// ------------------------------------------------------------------------------------
// NFC
// ------------------------------------------------------------------------------------

/**
 * trigger on nfc uid event, look up user and spit out coins
 *
 * @param uid
 * @private
 */

Cascade.prototype._handleNfcUid = function(uid) {
  this.findUserAndWithdraw(uid);
};

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

Cascade.prototype._handleAddUsbDevice = function(usbSerialID) {
  this.findUserAndWithdraw(usbSerialID);
};

// ------------------------------------------------------------------------------------
// RPI
// ------------------------------------------------------------------------------------

/**
 * Set pin high and after `delay` set pin low
 * @param delay in milliseconds
 */

function cycleSlot(delay) {
  gpio.write(config.rpi.relayPin, false, function(err) {
    if (err) {
      throw err;
    }
    setTimeout(function() {
      gpio.write(config.rpi.relayPin, true, function(err) {
        if (err) {
          throw err;
        }
      });
    }, delay);
  });
}

/**
 * Blink LED for a number of milliseconds
 * @param delay in milliseconds
 */

function blinkLED(delay) {
  gpio.write(config.rpi.ledPin, false, function(err) {
    if (err) throw err;
    setTimeout(function() {
      gpio.write(config.rpi.ledPin, true, function(err) {
        if (err) throw err;
      });
    }, delay)
  });
}

// ------------------------------------------------------------------------------------
// Exports
// ------------------------------------------------------------------------------------

module.exports = (function() {
  var instance;
  if (typeof instance === 'undefined') {
    instance = new Cascade();
  }
  return instance;
}());
