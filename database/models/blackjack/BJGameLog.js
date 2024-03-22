const sequelize = require('../../db-connection');
const { DataTypes } = require('sequelize');

const BJGameLog = sequelize.define('BJGameLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: sequelize.fn('gen_random_uuid'),
    primaryKey: true,
  },
  gameId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'BJGame',
      key: 'id',
    },
  },
  eventAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  event: {
    type: DataTypes.ENUM(['PLAYER_JOINED', 'PLAYER_HIT', 'PLAYER_STAND', 'PLAYER_BUST', 'DEALER_DRAWN', 'DEALER_BUST', 'PLAYER_BLACKJACK', 'DEALER_BLACKJACK', 'PLAYER_WIN', 'DEALER_WIN', 'PUSH']),
    allowNull: false,
  },
  playerId: {
    type: DataTypes.UUID,
    defaultValue: null,
    references: {
      model: 'Player',
      key: 'id',
      as: 'playerId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  // Additional event-specific data (optional)
}, {
  timestamps: true,
  tableName: 'BJGameLog',
});

BJGameLog.associate = (models) => {
  // Define associations with other models (e.g., Player, Hand)
  // ...
  BJGameLog.belongsTo(models.BJGame, { foreignKey: 'id' });
  BJGameLog.belongsTo(models.Player, { foreignKey: 'id' });
  // ...
};
// Optional: Add associations with other models (e.g., Player, Hand)

module.exports = BJGameLog;
