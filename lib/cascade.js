
/**
 * Module dependencies
 */

var _       = require('underscore');
var config  = require('./config.js');
var gpio    = require('rpi-gpio');
var log     = require('logule').init(module, 'cascade');
var nfc     = require('./nfc.js');
var usb     = require('./usb.js');
var user    = require('./user.js');

/**
 * Initialize Cascade
 *
 * @constructor
 */

function Cascade() {

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

  // ..

  log.info('init');
}

/**
 * init
 */

Cascade.prototype.init = function() {
  //stub
};

/**
 * init usb
 */

Cascade.prototype.initUsb = function() {
  /**
   * usb detection handlers
   */
  usb.on('add', this._handleAddUsbDevice.bind(this));
};

/**
 * init nfc detection handlers
 */

Cascade.prototype.initNfc = function() {
  nfc.on('uid', this._handleNfcUid.bind(this));
};

/**
 * find user for device event
 *
 * @param id device either usb serial or nfs uid/ats
 */

Cascade.prototype.findUserAndWithdraw = function(id) {

  user.findUserForDevice(id, function(error, user) {
    if (error) {
      //failed
      return;
    }

    if (!user) {
      //user doesn't exist
      return;
    }

    if (machine.balance < amount) {
      //machine is empty
      return;
    }

    if (user.balance < amount) {
      //user doesn't have cash
      return;
    }

    //machine.decrement

    //user.decrement
    //user.notify

  });

};

/**
 * withdraw `amount` from `username`
 *
 * @param username
 * @param amount
 */

Cascade.prototype.withdrawForUser = function(username, amount) {
  /**
   * user exists, see if they have any money
   *
   * @param res
   * @param next
   */
  User.find({
    where: {
      username: username
    }
  })
    .error(function(err) {
      throw err;
    })
    .success(function(user) {
      if(user === null) {
        log.error(user + ' does not have a cascade account');

        /**
         * blink LED to show no user account
         */

        blinkLED(config.ledBlinkTime);

      } else {
        if (user.balance >= amount) {

          /**
           * cycle relay and drop coins
           */

          cycleSlot(config.relayCycleTime);

          /**
           * update machine account
           */

          User.find(1).success(function(machine) {
            machine.decrement('balance', { by: amount });
          });

          /**
           * update user balance
           */

          user.decrement('balance', { by: amount });

          /**
           * send email if user has email?
           */

          if (user.email) {
            notifyNewBalance(user);
          }
        } else {
          log.error('user does not have enough funds');

          /**
           * blink LED three times to show no user funds
           */

          blinkLED(config.ledBlinkTime);
          setTimeout(function() {blinkLED(config.ledBlinkTime);}, config.ledBlinkTime*2*1);
          setTimeout(function() {blinkLED(config.ledBlinkTime);}, config.ledBlinkTime*2*2);

        }
      }
    }
  );
};

// ------------------------------------------------------------------------------------
// NFC
// ------------------------------------------------------------------------------------

/**
 * trigger on nfc ats event, look up user and spit out coins
 *
 * @param ats
 * @private
 */

Cascade.prototype._handleNfcAts = function(ats) {
  this.findUserAndWithdraw(ats);
};

/**
 * trigger on nfc uid event, look up user and spit out coins
 *
 * @param _uid
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
// RPI helpers
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


/**
 * Expose `Cascade`
 * @type {Cascade}
 */

module.exports = (function() {
  var instance;
  if (typeof instance === 'undefined') {
    instance = new Cascade();
  }
  return instance;
}());
