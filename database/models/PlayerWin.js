const { DataTypes } = require('sequelize');
const sequelize = require('../db-connection');

const PlayerWin = sequelize.define('PlayerWin', {
  winId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: sequelize.literal('uuid_generate_v4()'),
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
