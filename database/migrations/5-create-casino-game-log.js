'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check for PostgreSQL version (optional, adapt based on your environment)

    await queryInterface.createTable('CasinoGameLog', {
      gameLogId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'), // Adapt for older versions
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      gameId: {
        type: Sequelize.UUID,
        references: {
          model: 'CasinoGame',
          key: 'gameId',
          as: 'gameId',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        allowNull: false,
      },
      gameType: {
        type: Sequelize.ENUM('blackjack', 'poker', 'slots', 'roulette'),
        allowNull: false,
      },
      moveType: {
        type: Sequelize.ENUM('bet', 'win', 'loss', 'draw', 'move'),
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
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CasinoGameLog');
  },
};
