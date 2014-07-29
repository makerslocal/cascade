
/**
 * Module dependencies
 */

var _         = require('underscore');
var async     = require('async');
var config    = require('./config.js');
var gpio      = require('rpi-gpio');
var ldap      = require('./ldap.js');
var log       = require('logule').init(module, 'cascade');
var mandrill  = require('node-mandrill')(config.mandrillApiKey);
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

  gpio.setup(config.rpi.relayPin, gpio.DIR_OUT, function(err) {
    if (err) throw err;
    gpio.write(config.rpi.relayPin, true, function(err) {
      if (err) throw err;
    });
  });

  gpio.setup(config.rpi.ledPin, gpio.DIR_OUT, function(err) {
    if (err) throw err;
    gpio.write(config.rpi.ledPin, true, function(err) {
      if (err) throw err;
    });
  });

  // ..

  log.info('init');
}

/**
 * find user for device event
 *
 * @param id device either usb serial or nfs uid/ats
 */

Cascade.prototype.findUserAndWithdraw = function(id) {
  var self = this;
  async.waterfall([
    /**
     * check if ldap user exists for usb or nfc id
     * @param next
     */
    function findLdapUser(next) {
      ldap.findUserForDevice(id, function(err, ldapUser) {
        if (err) {
          return next(err, null);
        }
        next(null, ldapUser);
      });
    },
    /**
     * if no ldap user exists, check local db
     *
     * @param res
     * @param next
     */
    function findCascadeUser(user, next) {
      if (user != null) {
        return next(null, user['uid']); //ldap user exists, skip local db
      }

      User.find({
        where: ['nfcID=? or usbSerial=?', id, id],
        attributes: ['username']
      })
        .error(function(err) {
          throw err;
        })
        .success(function(user) {
          var username = user ? user.username : null;
          next(false, username);
      })
    },
  ],
    /**
     * done,
     *
     * @param err
     * @param result
     */
    function done(err, username) {
      if (err) {
        log.error('find user for device failed');
      }
      if (username) {
        User.find(1).success(function(machine) {
          if (machine.balance >= .50) {
            self.withdrawForUser(username, .50);
          } else {
            log.error('machine account empty!');
          }
        });
      } else {
        log.error('user does not exist for device: ' + id);
      }
    }
  );
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
      if(user == null) {
        log.error(user + ' does not have a cascade account');
      } else {
        if (user.balance > amount) {

          /**
           * cycle relay and drop coins
           */

          cycleSlot(config.relayCycleTime);

          /**
           * update machine account
           */

          User.find(1).success(function(machine) {
            machine.decrement('balance', { by: amount });
          })

          /**
           * update user balance
           */

          user.decrement('balance', { by: amount });

          /**
           * send email if user has email?
           */

          if (user.email) {
            mandrill('/messages/send', {
              message: {
                to: [{email: user.email, name: user.username}],
                from_email: 'no-reply@makerslocal.org',
                subject: "[Cascade] Receipt",
                text: "Hi " + user.username + ", your current balance is: " + user.balance.toFixed(2)
              }
            }, function(err, response) {
              if (err) {
                log.error(err);
              }
              // ..
            });
          }
        } else {
          log.error('user does not have enough funds');
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

module.exports = (function() {
  var instance;
  if (typeof instance === 'undefined') {
    instance = new Cascade();
  }
  return instance;
}());;

/**
 * Init & return new Cascade instance
 * @type {Function}
 */

module.exports.init = (function() {
  var instance = null;
  if (instance == null) {
    instance = new Cascade();
  }
  return instance;
});
