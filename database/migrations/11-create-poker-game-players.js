'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PokerGamePlayers', {
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
            },
        },
        playerId: {
            type: Sequelize.STRING,
            defaultValue: null,
            references: {
              model: 'Player',
              key: 'playerId',
              as: 'playerId',
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          },
        seatNumber: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
    await queryInterface.dropTable('PokerGamePlayers');
  }
};