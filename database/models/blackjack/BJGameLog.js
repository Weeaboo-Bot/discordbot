const sequelize = require('../../db-connection');

const BJGameLog = sequelize.define('BJGameLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.fn('gen_random_uuid'),
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
    defaultValue: Sequelize.NOW,
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
    },
  },
  handId: {
    type: DataTypes.UUID,
    defaultValue: null,
    references: {
      model: 'BJHand',
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  // Additional event-specific data (optional)
}, {
  timestamps: true,
  tableName: 'BJGameLog',
});

BJGameLog.belongsTo(BJGame, { foreignKey: 'gameId' });  // Define association with Game model
BJGameLog.belongsTo(Player, { foreignKey: 'playerId' });
BJGameLog.belongsTo(BJHand, { foreignKey: 'handId' });

// Optional: Add associations with other models (e.g., Player, Hand)

module.exports = BJGameLog;
