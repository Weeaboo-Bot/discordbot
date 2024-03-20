'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CasinoGame', [{
      gameId: 1,
      data: '[1,2,3,4]',
      gameType: 'blackjack',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CasinoGame', null, {});
  }
};
