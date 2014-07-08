
/**
 * Module dependencies
 */

var config    = require('./config.js');
var express   = require('express');
var app       = express();
var log       = require('logule').init(module, 'http');

/**
 * HTTP
 */

function http() {

  /**
   * Configure our middleware
   */

  app.set('port', process.env.PORT || 3000);
  app.use(function(req, res, next) {
    req.startDate = Date.now();
    next();
  });
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
// ------------------------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------------------------
//app.use('/actions', require('./routes.js'));
// ------------------------------------------------------------------------------------
  app.use(function(req, res, next) {
    log.info('%s %s :: took %sms', req.method, req.url, (Date.now() - req.startDate));
    next();
  });
  app.use(express.errorHandler());
  app.use(function(req, res) {
    res.status(404);
    res.send({
      message: 'Not Found'
    });
  });

  // ..

  app.listen(app.get('port'), function() {
    log.info('listening on port %d', app.get('port'));
  });
}

/**
 * Expose HTTP
 */

module.exports = http;