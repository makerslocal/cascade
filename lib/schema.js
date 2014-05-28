var caminte = require('caminte')
  , log     = require('logule').init(module, 'schema')
  // ..
  , config  = require('./config');

module.exports = (function() {
  var schema = undefined;
  if (typeof schema === 'undefined') {
    db = {
      driver     : "sqlite3",
      database   : config.sqlite.db
    };
    schema = new caminte.Schema(db.driver, db);
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
