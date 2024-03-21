const { DataTypes } = require('sequelize');
const sequelize = require('../db-connection');

const CasinoGame = sequelize.define('CasinoGame', {
  gameId: {
    type: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
    unique: true,
    defaultValue: sequelize.literal('uuid_generate_v4()'),
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
