var util = require('util');

module.exports = {
  http : {
    port  : 80
  },
  modelPath: util.format('%s/models/', __dirname),
  sqlite : {
    db    : '/Users/dusty/Downloads/cash_db'
  }
};
