const { DataTypes } = require('sequelize');
const sequelize = require('../db-connection');

const CasinoGame = sequelize.define('CasinoGame', {
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  gameType: {
    type: DataTypes.ENUM,
    values: ['blackjack', 'poker', 'slots', 'roulette'],
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'CasinoGame',
});

module.exports = CasinoGame;
