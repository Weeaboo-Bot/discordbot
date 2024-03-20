const sequelize = require('../db-connection');

const Player = require('./Player');
const PlayerWin = require('./PlayerWin');
const PlayerLoss = require('./PlayerLoss');
const CasinoGame = require('./CasinoGame');
const CasinoGameLog = require('./CasinoGameLog');

module.exports = {
  Player,
  PlayerWin,
  PlayerLoss,
  CasinoGame,
  CasinoGameLog,
};
