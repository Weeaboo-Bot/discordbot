'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PokerHand', {
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
        playerId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'PokerGamePlayers',
            key: 'id',
            as: 'playerId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }
        },
        cards: {
          type: Sequelize.JSON, // Store card data as an array of objects
          allowNull: false,
        },
        rank: {
          type: Sequelize.STRING, // Store the poker hand rank (e.g., "Full House", "Straight Flush")
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
    await queryInterface.dropTable('PokerHand');
  }
};