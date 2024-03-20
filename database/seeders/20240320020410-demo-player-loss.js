'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PlayerLoss', [{
      lossId: 1,
      gameType: 'blackjack',
      betAmount: 100,
      lossAmount: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PlayerLoss', null, {});
  }
};
