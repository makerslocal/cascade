module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Transactions', {
    id: DataTypes.INTEGER,
    users_id: DataTypes.INTEGER,
    timestamp: DataTypes.DATE,
    usd: DataTypes.FLOAT
  }, {
    instanceMethods: {
      // ..
    }
  });
};