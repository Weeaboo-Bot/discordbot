const sequelize = require('../../db-connection');
const { DataTypes } = require('sequelize');

const PokerGameLog = sequelize.define('PokerGameLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: sequelize.fn('gen_random_uuid'),
        primaryKey: true,
    },
    gameId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'PokerGame',
            key: 'id',
            as: 'gameId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    },
    eventAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    event: {
        type: DataTypes.ENUM(['GAME_STARTED', 'PLAYER_JOINS', 'PLAYER_LEAVES', 'DEAL_HOLES', 'BLINDS_POSTED', 'PRE_FLOP_BETTING', 'FLOP_REVEALED', 'FLOP_BETTING', 'TURN_REVEALED', 'TURN_BETTING', 'RIVER_REVEALED', 'RIVER_BETTING', 'SHOWDOWN', 'POT_AWARDED', 'GAME_ENDED']),
        allowNull: false,
    },
    actingPlayerId: {
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: 'Player',
            key: 'id',
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
    // Optional: Additional event-specific data (e.g., bet amount, card data)
    communityCards: {
        type: DataTypes.JSON,  // Store community cards data (optional)
        allowNull: false,
    },
}, {
    timestamps: true,
    tableName: 'PokerGameLog',
});

PokerGameLog.associate = (models) => {
    // Define associations with other models (e.g., Player, Hand)
    // ...
    PokerGameLog.belongsTo(models.PokerGame, { foreignKey: 'id' });
    PokerGameLog.belongsTo(models.Player, { foreignKey: 'id' });
    // ...
  };

module.exports = PokerGameLog;