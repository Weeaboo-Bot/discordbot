'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CasinoGameLog', {
      gameLogId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      gameId: {
        type: Sequelize.INTEGER,
        references: {
          module: 'CasinoGame',
          key: 'gameId',
          as: 'gameId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          allowNull: false,
        }
      },
      gameType: {
        type: Sequelize.ENUM,
        values: ['blackjack', 'poker', 'slots', 'roulette'],
        allowNull: false,
  
      },
      moveType: {
        type: Sequelize.ENUM,
        values: ['bet', 'win', 'loss', 'draw', 'move'],
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'Player',
          key: 'userId',
          as: 'userId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          allowNull: false,
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CasinoGameLog');
  }
};