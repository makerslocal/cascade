var fs        = require('fs')
  , log       = require('logule').init(module, 'model')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , util      = require('util')
  // ..
  , config    = require('./config');

// ------------------------------------------------------------------------------------
// Sequelize conf
// ------------------------------------------------------------------------------------

var sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  logging: function(msg) {
    log.info(msg);
  },
  storage: config.sqlite.db
});

module.exports.sequelize = sequelize;

// ------------------------------------------------------------------------------------
// Import our models
// ------------------------------------------------------------------------------------

fs.readdirSync(config.modelPath).forEach(function(file) {
  var modelFile = config.modelPath + file
    , modelName = path.basename(modelFile, '.js');
  log.info('importing \'%s\' model', modelName);

  module.exports[modelName] = sequelize.import(modelFile);
});




