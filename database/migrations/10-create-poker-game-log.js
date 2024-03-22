'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PokerGameLog', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.fn('gen_random_uuid'),
            primaryKey: true,
        },
        gameId: {
            type: Sequelize.UUID,
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
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        event: {
            type: Sequelize.ENUM(['GAME_STARTED', 'PLAYER_JOINS', 'PLAYER_LEAVES', 'DEAL_HOLES', 'BLINDS_POSTED', 'PRE_FLOP_BETTING', 'FLOP_REVEALED', 'FLOP_BETTING', 'TURN_REVEALED', 'TURN_BETTING', 'RIVER_REVEALED', 'RIVER_BETTING', 'SHOWDOWN', 'POT_AWARDED', 'GAME_ENDED']),
            allowNull: false,
        },
        actingPlayerId: {
            type: Sequelize.STRING,
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
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
        },
        // Optional: Additional event-specific data (e.g., bet amount, card data)
        communityCards: {
            type: Sequelize.JSON,  // Store community cards data (optional)
            allowNull: false,
        },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PokerGameLog');
  }
};