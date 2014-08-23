
/**
 * Module dependencies
 */

var async = require('async');
var ldap  = require('./ldap.js');
var model = require('./model.js');
var user  = model.User;

/**
 * find user for device
 * @param device
 */

module.exports.findUserForDevice = function(device_id, fn) {
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
        if (user !== null) {
          return next(null, user.uid); //ldap user exists, skip local db
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
          });
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
          if (machine.balance >= 0.50) {
            self.withdrawForUser(username, 0.50);
          } else {
            log.error('machine account empty!');

            /**
             * long blink LED to show machine funds
             */

            blinkLED(3*config.ledBlinkTime);

          }
        });
      } else {
        log.error('user does not exist for device: ' + id);

        /**
         * blink LED to show no user account
         */

        blinkLED(config.ledBlinkTime);
      }
    }
  );
};