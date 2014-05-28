var db = require('./db.js')
  , User = require('./models/user.js');

User.findUserByUsername('mog', function(user) {
  console.log(user);
});
