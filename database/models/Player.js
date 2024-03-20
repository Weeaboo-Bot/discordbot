const { DataTypes } = require('sequelize');
const sequelize = require('../db-connection');

module.exports = () => {
  const Player = sequelize.define('Player', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userTag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    // Additional model options if needed
  });

  // Define associations (optional)
  Player.associate = (models) => {
    // Define associations here (e.g., with CasinoGameLog)
  };

  return Player;
};
