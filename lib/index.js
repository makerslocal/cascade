 var express  = require('express')
  , app       = express()
  , log       = require('logule').init(module, 'cascade')
  // ..
  , config    = require('./config.js')
  , schema    = require('./model.js');

// ------------------------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------------------------

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

var model = require('./model.js')
   , User = model.User;

 User.find({ include: { model: model.Transaction, as: 'Transactions', limit: 50}, where: { username:'mog' } })
   .error(function(err) {
     console.log(err);
   })
   .success(function(user) {
     console.log(user.transactions[0])
   });
// ..

app.listen(app.get('port'), function() {
  log.info('listening on port %d', app.get('port'));
});

module.exports = app;
