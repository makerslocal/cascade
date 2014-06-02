var caminte = require('caminte')
  , log     = require('logule').init(module, 'schema').unmute('debug')
  // ..
  , config  = require('./config');

module.exports = (function() {
  var schema = undefined;
  if (typeof schema === 'undefined') {
    db = {
      driver     : "sqlite3",
      database   : config.sqlite.db
    };
    try {
      schema = new caminte.Schema(db.driver, db);
    } catch(err) {
      log.error(err);
    }
  }

  schema.on('connected', function() {
    log.info('connected');
  });

  schema.on('log', function(sql, t) {
    var now = Date.now();
    log.info(sql + ' :: took ' + (now - t) + 'ms');
  });

  return schema;
}());
