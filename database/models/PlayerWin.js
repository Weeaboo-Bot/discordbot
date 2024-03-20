const { DataTypes } = require('sequelize');
const sequelize = require('../db-connection');

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
  timestamps: true,
  tableName: 'PlayerWin',
});


module.exports = PlayerWin;
