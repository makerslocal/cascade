
/**
 * Module dependencies
 */

var cascade   = require('./cascade.js');
var ldap      = require('./ldap.js');
var log       = require('logule').init(module, 'http');
var restify   = require('restify');
var validate  = require('paperwork');

/**
 * http
 * @see http://mcavage.me/node-restify/
 */

function http() {
  var self = this;

  // ..

  this.server = restify.createServer({
    name: 'cascade',
    version: '1.0.0'
  });

  this.server.use(restify.acceptParser(this.server.acceptable));
  this.server.use(restify.queryParser());
  this.server.use(restify.bodyParser());

  this.server.post('/withdraw/', function (req, res, next) {
    if (req.params.username === undefined) {
      return next(new restify.InvalidArgumentError('Username must be supplied'));
    }

    if (req.params.password === undefined) {
      return next(new restify.InvalidArgumentError('Password must be supplied'));
    }

    var username = req.params.username;
    var password = req.params.password;

    ldap.authenticate(username, password, function (err, authenticated) {
      if (err) {
        log.error(err.message);

        ret = new Error('Not authorized');
        ret.statusCode = 401;

        return next(ret);
      } else {
        if (authenticated) {
          cascade.withdrawForUser(username, .50);
        }
        res.send(200);
        return next();
      }
    });
  });

  // ..

  this.server.listen(8080, '127.0.0.1', function () {
    log.info('%s listening on %s', self.server.name, self.server.url);
  });
}

/**
 * Expose `http`
 * @type {http}
 */

module.exports = new http();
