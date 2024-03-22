'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PokerGame', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.fn('gen_random_uuid'),
            primaryKey: true,
          },
          tableName: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          maxPlayers: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          blindLevel: {
            type: Sequelize.INTEGER,
            allowNull: true,
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
    await queryInterface.dropTable('PokerGame');
  }
};