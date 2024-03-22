const { Player, PlayerLoss, PlayerWin, BJGame, BJGameLog, PokerGame, PokerGameLog, PokerGamePlayers, RouletteGame, RouletteGameLog } = require('../database/models/index');
const { v4: uuidv4 } = require('uuid');

// Import the event types
const gameEvents = require('../assets/json/game-events.json');
const blackjackEvents = require('../assets/json/blackjack-events.json');
const pokerEvents = require('../assets/json/poker-events.json');
const rouletteEvents = require('../assets/json/roulette-events.json');

const gameTypes = require('../assets/json/game-types.json');
module.exports = class DBHelper {
  constructor(casinoUsers, casinoGames, gameLog, logger) {
    this.casinoUsers = casinoUsers; // collection of casino players
    this.casinoGames = casinoGames; // collection of casino games
    this.gameLog = gameLog; // collection of game logs
    this.logger = logger;
  }
  convertTimestamp(timestamp) {
    const date = new Date(timestamp);
    return Math.floor(date.getTime() / 1000);
  }
  async addBalance(id, amount) {
    const player = this.casinoUsers.get(id);

    if (player) {
      player.balance += Number(amount);
      await Player.update({ balance: player.balance }, {
        where: { userId: id },
      });
      return player ? player.balance : 0;
    }
    this.logger.info('Player not found');
  }
  async getBalance(id) {
    const player = this.casinoUsers.get(id);
    return player ? player.balance : 0;
  }
  async createPlayer(playerData) {
    const newPlayer = await Player.create(playerData);
    this.casinoUsers.set(newPlayer.userId, newPlayer);
    return newPlayer;
  }
  async deletePlayer(id) {
    const player = this.casinoUsers.get(id);

    if (player) {
      const affectedRows = await Player.destroy({ where: { userId: id } });

      if (affectedRows > 0) {
        this.casinoUsers.delete(id);
        return player; // Return the deleted player object
      } else {
        throw new Error('No player rows were deleted from the database.');
      }
    } else {
      return null; // Indicate player not found
    }
  }
  async createGame(gameData) {
    let newGame;
    // newGame.id = uuidv4();
    switch (gameLogData.gameType) {
      case gameTypes.BLACKJACK:
        gameLogData.gameEvent = blackjackEvents;
        newGame = await BJGame.create(gameLogData);
        this.gameLog.set(newGameLog.gameLogId, newGameLog); // Add the new game log to the collection
        break;
      case gameTypes.POKER:
        gameLogData.gameEvent = pokerEvents;
        newGame = await PokerGame.create(gameLogData);
        this.gameLog.set(newGameLog.gameLogId, newGameLog); // Add the new game log to the collection
        break;
      case gameTypes.ROULETTE:
        gameLogData.gameEvent = rouletteEvents;
        newGame = await RouletteGame.create(gameLogData);
        this.gameLog.set(newGameLog.gameLogId, newGameLog); // Add the new game log to the collection
        break;
      default:
        gameLogData.gameEvent = 'INVALID_GAME_TYPE';
    }
    this.casinoGames.set(newGame.id, gameData); // Add the new game to the collection
    return newGame; // Return the newly created game log object
  }
  async deleteGame(id, force) {
    const game = this.casinoGames.get(id);

    if (game && force) {
      const affectedRows = await CasinoGame.destroy({ where: { gameId: id } });

      if (affectedRows > 0) {
        this.casinoGames.delete(id);
        return game; // Return the deleted game object
      } else {
        throw new Error('No game rows were deleted from the database.');
      }
    } else if (!force) {
      this.casinoGames.delete(id);
      return game;
    } else {
      return null; // Indicate game not found
    }
  }
  async createGameLog(gameLogData) {
    let newGameLog;
    switch (gameLogData.gameType) {
      case gameTypes.BLACKJACK:
        gameLogData.gameEvent = blackjackEvents;
        newGameLog = await BJGameLog.create(gameLogData);
        this.gameLog.set(newGameLog.gameLogId, newGameLog); // Add the new game log to the collection
        break;
      case gameTypes.POKER:
        gameLogData.gameEvent = pokerEvents;
        newGameLog = await PokerGameLog.create(gameLogData);
        this.gameLog.set(newGameLog.gameLogId, newGameLog); // Add the new game log to the collection
        break;
      case gameTypes.ROULETTE:
        gameLogData.gameEvent = rouletteEvents;
        newGameLog = await RouletteGameLog.create(gameLogData);
        this.gameLog.set(newGameLog.gameLogId, newGameLog); // Add the new game log to the collection
        break;
      default:
        gameLogData.gameEvent = 'INVALID_GAME_TYPE';
    }
    return newGameLog; // Return the newly created game log object
  }
  async deleteGameLog(id) {
    const gameLog = this.casinoGames.get(id);

    if (gameLog) {
      const affectedRows = await CasinoGameLog.destroy({ where: { gameLogId: id } });

      if (affectedRows > 0) {
        this.casinoGames.delete(id);
        return gameLog; // Return the deleted game log object
      } else {
        throw new Error('No game log rows were deleted from the database.');
      }
    } else {
      return null; // Indicate game log not found
    }
  }
}
