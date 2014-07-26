
/**
 * Module dependencies
 */

var _         = require('underscore');
var async     = require('async');
var config    = require('./config.js');
var gpio      = require('rpi-gpio');
var ldap      = require('./ldap.js');
var log       = require('logule').init(module, 'cascade');
var model     = require('./model.js');
var nfc       = require('./nfc.js');
var Sequelize = require('sequelize');
var usb       = require('./usb.js');
var User      = model.User;

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
   * usb detection handlers
   */

  usb.on('add', self._handleAddUsbDevice.bind(self));

  /**
   * nfc detection handlers
   */

  nfc.on('ats', self._handleNfcAts.bind(self));
  nfc.on('uid', self._handleNfcUid.bind(self));

  /**
   * setup rpi pins
   *
   * GPIO 21 = change slot relay
   * GPIO 12 = status light
   *
   * @see https://github.com/JamesBarwell/rpi-gpio.js
   */

  // change slot relay

  gpio.setup(config.rpi.relayPin, gpio.DIR_OUT, function(err) {
    if (err) throw err;
    gpio.write(config.rpi.relayPin, true, function(err) {
      if (err) throw err;
    });
  });

  // front status led

  gpio.setup(config.rpi.ledPin, gpio.DIR_OUT, function(err) {
    if (err) throw err;
    gpio.write(config.rpi.ledPin, true, function(err) {
      if (err) throw err;
    });
  });

  // ..

  log.info('running!');
}

/**
 * find user for device event
 *
 * @param id
 * @param fn
 */

Cascade.prototype.findUserForDevice = function(id, fn) {
  var self = this;
  async.waterfall([
    /**
     * check if user exists for usb or nfc id
     * @param next
     */
    function(next) {
      ldap.findUserForDevice(id, function(err, ldapUser) {
        if (err) {
          next(err, null);
        } else {
          if (ldapUser) {
            next(null, ldapUser);
          } else {
            next(null, null);
          }
        }
      });
    },
    /**
     * if no ldap user, check local cache
     *
     * @param res
     * @param next
     */
    function(user, next) {
      if (user != null) {
        return next(null, user['uid']);
      }
      User.find({
        where: { usbSerial: id},
        attributes: ['id', 'username', 'balance']
      }).success(function(user) {
        if(user == null) {
          log.error('user does not exist in cascade db');
          return next(true, null);
        }
        next(false, user.username);
      })
    },
    /**
     * user exists, see if they have any money
     *
     * @param res
     * @param next
     */
    function(user, next) {
      User.find({
        where: {
          username: user
        }
      })
        .error(function(err) {
          next(true, null);
        })
        .success(function(user) {
          if(user == null) {
            log.error('user does not exist in cascade db');
            return next(true, null);
          }
          next(false, user.balance);
        }
      );
    }
  ],
    /**
     *
     * @param err
     * @param result
     */
    function (err, balance) {
      if (err) {
        log.error("find user for device failed!");
      }
      if (balance > .50) {
        cycleSlot(100);
      }
      fn(err, balance);
    }
  );
};

/**
 * withdrawal `amount` from `user` account
 *
 * @param userId
 * @param amount
 */

Cascade.prototype.withdrawalForUser = function(userId, amount) {

};

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

Cascade.prototype._handleAddUsbDevice = function(id) {
  log.info('added usb: ' + id);
  this.findUserForDevice(id, function(err, result) {
    // ..
  });
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
