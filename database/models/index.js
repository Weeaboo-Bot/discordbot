const sequelize = require('../db-connection');

const Player = require('./player/Player');
const PlayerWin = require('./player/PlayerWin');
const PlayerLoss = require('./player/PlayerLoss');
const BJGame = require('./blackjack/BJGame');
const BJGameLog = require('./blackjack/BJGameLog');

const PokerGame = require('./poker/PokerGame');
const PokerGameLog = require('./poker/PokerGameLog');
const PokerGamePlayers = require('./poker/PokerGamePlayers');

const RouletteGame = require('./roulette/RouletteGame');
const RouletteGameLog = require('./roulette/RouletteGameLog');

module.exports = {
  Player,
  PlayerWin,
  PlayerLoss,
  BJGame,
  BJGameLog,
  PokerGame,
  PokerGameLog,
  PokerGamePlayers,
  RouletteGame,
  RouletteGameLog,
};
