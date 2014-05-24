var log     = require('logule').init(module, 'db')
  , sys     = require('sys')
  , sqlite3 = require('sqlite3').verbose()
  // ..
  , config  = require('./config');

module.exports = (function() {
  var db = undefined;
  if (typeof db === 'undefined') {
    db = new sqlite3.Database(config.sqlite.db);

    /**
     * handle db error and bail
     */

    db.on('error', function(e) {
      log.error(e.toString());
    });

    /**
     * handle db open
     */

    db.on('open', function() {
      log.info('db open');
    });
  }
  return db;
}());