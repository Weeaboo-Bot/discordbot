const { DataTypes } = require('sequelize');
const sequelize = require('../db-connection');

const CasinoGameLog = sequelize.define('CasinoGameLog', {
  gameLogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  gameId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'CasinoGame',
      key: 'gameId',
    },
    allowNull: false,
  },
  gameType: {
    type: DataTypes.ENUM,
    values: ['blackjack', 'poker', 'slots', 'roulette'],
    allowNull: false,
  },
  moveType: {
    type: DataTypes.ENUM,
    values: ['bet', 'win', 'loss', 'draw', 'move'],
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    references: {
      model: 'Player',
      key: 'userId',
    },
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'CasinoGameLog',
});

// Define associations (optional)
CasinoGameLog.associate = (models) => {
  // Define association with Player model here
  CasinoGameLog.belongsTo(models.Player, { foreignKey: 'userId', as: 'userId' });
  CasinoGameLog.belongsTo(models.CasinoGame, { foreignKey: 'gameId', as: 'gameId' });
};

module.exports = CasinoGameLog;
