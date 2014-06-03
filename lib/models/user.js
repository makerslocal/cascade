module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    id: DataTypes.INTEGER,
    username: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    instanceMethods: {
      // ..
    }
  });
};