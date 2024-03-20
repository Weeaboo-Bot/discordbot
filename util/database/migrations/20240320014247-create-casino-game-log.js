'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CasinoGameLog', {
      gameLogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      gameType: {
        type: DataTypes.ENUM,
        values: ['blackjack', 'poker', 'slots', 'roulette'],
        allowNull: false,
  
      },
      moveType: {
        type: DataTypes.ENUM,
        values: ['bet', 'win', 'loss', 'draw'],
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
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