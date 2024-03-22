'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BJGameLog', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.fn('gen_random_uuid'),
            primaryKey: true,
          },
          gameId: {
            type: Sequelize.UUID,
            defaultValue: null,
            references: {
              model: 'BJGame',
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
            type: Sequelize.ENUM(['PLAYER_JOINED', 'PLAYER_HIT', 'PLAYER_STAND', 'PLAYER_BUST', 'DEALER_DRAWN', 'DEALER_BUST', 'PLAYER_BLACKJACK', 'DEALER_BLACKJACK', 'PLAYER_WIN', 'DEALER_WIN', 'PUSH']),
            allowNull: false,
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
    await queryInterface.dropTable('BJGameLog');
  }
};