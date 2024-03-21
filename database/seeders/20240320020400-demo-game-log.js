'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('CasinoGameLog', [{
      gameLogId: uuidv4(),
      gameId: uuidv4(),
      gameType: 'blackjack',
      moveType: 'win',
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('CasinoGameLog', null, {});
  }
};
