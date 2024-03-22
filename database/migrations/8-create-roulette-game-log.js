'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RouletteGameLog', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.fn('gen_random_uuid'),
            primaryKey: true,
          },
          gameId: {
            type: Sequelize.UUID,
            defaultValue: null,
            references: {
              model: 'RouletteGame',
              key: 'id',
              as: 'gameId',
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          },
          playerId: {
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
          eventAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          event: {
            type: Sequelize.ENUM(['PLAYER_JOINED', 'PLAYER_PLACED_BET', 'PLACED_BETS_CLOSED', 'WHEEL_SPUN', 'BALL_LANDED', 'WINNINGS_DISTRIBUTED', 'ROUND_ENDED', 'GAME_ENDED']),
            allowNull: false,
          },
          winningNumber: {
            type: Sequelize.INTEGER,
            defaultValue: null,
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RouletteGameLog');
  }
};