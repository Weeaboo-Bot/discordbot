'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PlayerWin', [{
      winId: uuidv4(),
      gameType: 'blackjack',
      betAmount: 100,
      winAmount: 200,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PlayerWin', null, {});
  }
};
