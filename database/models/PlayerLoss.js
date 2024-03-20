const { DataTypes } = require('sequelize');
const sequelize = require('../db-connection');


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
  timestamps: true,
  tableName: 'PlayerLoss',
});


module.exports = PlayerLoss;
