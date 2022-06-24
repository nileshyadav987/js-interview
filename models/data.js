
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Data', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    randAlphabet: DataTypes.STRING,
  });
}