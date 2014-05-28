var config        = require('./config.js');

var caminte = require('caminte'),
  Schema = caminte.Schema,
  db = {
    driver     : "sqlite3",
    database   : config.sqlite.db
  };

var schema = new Schema(db.driver, db);

var User = schema.define('users', {
  id: Number,
  email: String,
  username: String
});

var Query = User.find();
Query.where('username', 'mog');
Query.order('id', 'ASC');

Query.run({},function(err, users){
  console.log(users);
});