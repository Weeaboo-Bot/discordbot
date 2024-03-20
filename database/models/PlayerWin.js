const { DataTypes } = require('sequelize');
const sequelize = require('../db-connection');

module.exports = () => {
  const PlayerWin = sequelize.define('PlayerWin', {
    winId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    gameType: {
      type: DataTypes.ENUM,
      values: ['blackjack', 'poker', 'slots', 'roulette'],
      allowNull: false,
    },
    betAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    winAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    // Additional model options if needed
  });

  // Define associations (optional)
  PlayerWin.associate = (models) => {
    // Define associations here (e.g., with Player)
  };

  return PlayerWin;
};
