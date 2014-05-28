var connect = require('connect')
  , express = require('express')
  , app = express()
  , log = require('logule').init(module, 'cascade')
  // ..
  , config = require('./config.js')
  , schema = require('./schema.js');

// ------------------------------------------------------------------------------------
// Express
// ------------------------------------------------------------------------------------

app.set('port', process.env.PORT || 3000);
app.use(function(req, res, next) {
  req.startDate = Date.now();
  next();
});
app.use(connect.json());
app.use(connect.urlencoded());
app.use(connect.methodOverride());
// ------------------------------------------------------------------------------------
// Register routes
// ------------------------------------------------------------------------------------
//app.use('/actions', require('./routes.js'));
// ------------------------------------------------------------------------------------
app.use(function(req, res, next) {
  log.info('%s %s :: took %sms', req.method, req.url, (Date.now() - req.startDate));
  next();
});
app.use(connect.errorHandler());
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

module.exports = app;