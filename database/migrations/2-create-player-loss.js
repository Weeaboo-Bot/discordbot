'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PlayerLoss', {
      lossId: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      gameType: {
        type: Sequelize.ENUM,
        values: ['blackjack', 'poker', 'slots', 'roulette'],
        allowNull: false,
      },
      betAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lossAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PlayerLoss');
  }
};