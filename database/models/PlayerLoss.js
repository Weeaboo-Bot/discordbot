const { DataTypes } = require('sequelize');
const sequelize = require('../db-connection');

module.exports = () => {
  const PlayerLoss = sequelize.define('PlayerLoss', {
    lossId: {
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
    lossAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    // Additional model options if needed
  });

  // Define associations (optional)
  PlayerLoss.associate = (models) => {
    // Define associations here
  };

  return PlayerLoss;
};
