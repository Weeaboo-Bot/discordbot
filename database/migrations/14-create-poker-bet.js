'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PokerBet', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.fn('gen_random_uuid'),
            primaryKey: true,
        },
        betAmount: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        playerId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Player',
                key: 'id',
            },
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
    await queryInterface.dropTable('PokerBet');
  }
};