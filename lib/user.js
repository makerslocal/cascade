
/**
 * Module dependencies
 */

var async = require('async');
var ldap  = require('./ldap.js');
var model = require('./model.js');
var User  = model.User;

// ------------------------------------------------------------------------------------
// Find cascade user
// ------------------------------------------------------------------------------------

/**
 * find cascade user for given device
 *
 * @param device_id device
 * @param fn callback
 */

module.exports.findUserForDevice = function(device_id, fn) {
  async.waterfall(
    [
      findLdapUser(device_id, next),
      findCascadeUser(device_id, ldapUser, done)
    ],
    function done(err, cascadeUser) {
      if (err) {
        log.error('find user for device failed');
      }
      fn(err, cascadeUser)
    }
  );
};

// ------------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------------

/**
 * find an ldap user for a given device
 *
 * @param device id
 * @param fn callback
 */

function findLdapUser(device, next) {
  ldap.findUserForDevice(device, function(err, ldapUser) {
    if (err) {
      /**
       * device, error, no ldap user
       */
      return next(device, err, undefined);
    }
    /**
     * device, no error, ldap user
     */
    return next(device, undefined, ldapUser);
  });
}

/**
 * find cascade user for given device or ldap user
 *
 * @param device id
 * @param ldapUser user
 * @param fn callback
 */

function findCascadeUser(device, ldapUser, done) {
  User.find({
    where: ['uid = ?, nfcID=? or usbSerial=?',ldapUser.uid, device, device],
    attributes: ['username', 'balance']
  })
  .error(function(err) {
    throw err;
  })
  .success(function(user) {
    return done(undefined, user);
  });
}
