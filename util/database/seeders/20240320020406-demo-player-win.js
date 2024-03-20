'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PlayerWins', [{
      winId: 1,
      gameType: 'blackjack',
      betAmount: 100,
      winAmount: 200,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PlayerWins', null, {});
  }
};