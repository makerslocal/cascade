
/**
 * Module dependencies
 */

var util = require('util');

/**
 * Configuration options
 */

module.exports = {
  relayCycleTime : 250,
  http : {
    enabled : true,
    port    : 80
  },
  modelPath : util.format('%s/models/', __dirname),
  sqlite : {
    db    : '/Users/dusty/Downloads/cash_db'
  }
};
