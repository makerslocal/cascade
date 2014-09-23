
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

module.exports.findUserForDevice = function(device, fn) {
  async.waterfall(
    [
      findLdapUser(device, next),
      findCascadeUser(device, ldapUser, done)
    ],
    function done(err, cascadeUser) {
      if (err) {
        log.error('find user for device failed');
      }
      fn(err, cascadeUser);
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

function findLdapUser(device, fn) {
  ldap.findUserForDevice(device, function(err, ldapUser) {
    if (err) {
      return fn(err, device, undefined);
    }
    fn(undefined, device, ldapUser);
  });
}

/**
 * find cascade user for given device OR given ldap user
 *
 * @param device id
 * @param ldapUser user
 * @param fn callback
 */

function findCascadeUser(device, ldapUser, fn) {
  var uid = ldapUser ? ldapUser.uid : undefined;
  User.find({
    where: ['uid=? OR nfcID=? OR usbSerial=?', uid, device, device],
    attributes: ['username', 'balance']
  })
  .error(function(err) {
    throw err;
  })
  .success(function(user) {
    return fn(undefined, user);
  });
}
