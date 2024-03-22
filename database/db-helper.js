const { Player, PlayerLoss, PlayerWin, BJGame, BJGameLog, BJHand, PokerGame, PokerGameLog, PokerGamePlayers, PokerHand, RouletteGame, RouletteGameLog, BJBet, PokerBet } = require('../database/models/index');
const { v4: uuidv4 } = require('uuid');

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
        where: { id: id },
      });
      return player ? player.balance : 0;
    }
    this.logger.info('Player not found');
  }
  async removeBalance(id, amount) {
    const player = this.casinoUsers.get(id);

    if (player) {
      player.balance -= Number(amount);
      await Player.update({ balance: player.balance }, {
        where: { id: id },
      });
      return player ? player.balance : 0;
    }
    this.logger.info('Player not found');
  }
  async getBalance(id) {
    const player = this.casinoUsers.get(id);
    // also check db
    if (!player) {
      const dbPlayer = await Player.findOne({ where: { id: id } });
      if (dbPlayer) {
        this.casinoUsers.set(id, dbPlayer);
        return dbPlayer.balance;
      }
    }
    return player ? player.balance : 0;
  }
  async isPlayer(id) {
    const player = this.casinoUsers.get(id);
    if (!player) {
      const dbPlayer = await Player.findOne({ where: { id: id } });
      if (dbPlayer) {
        this.casinoUsers.set(id, dbPlayer);
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
  async createPlayer(playerData) {
    const newPlayer = await Player.create(playerData);
    this.casinoUsers.set(newPlayer.id, newPlayer);
    return newPlayer;
  }
  async deletePlayer(id) {
    const player = this.casinoUsers.get(id);

    if (player) {
      const affectedRows = await Player.destroy({ where: { id: id } });

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

  async getAllPlayers() {
    const players = await Player.findAll();
    return players;
  }
  async createGame(gameData, gameType) {
    let newGame;
    gameData.id = uuidv4();
    // newGame.id = uuidv4();
    switch (gameType) {
      case gameTypes.BLACKJACK:
        newGame = await BJGame.create(gameData);
        this.casinoGames.set(newGame.id, gameData); // Add the new game log to the collection
        break;
      case gameTypes.POKER:
        newGame = await PokerGame.create(gameData);
        this.casinoGames.set(newGame.id, gameData); // Add the new game log to the collection
        break;
      case gameTypes.ROULETTE:
        newGame = await RouletteGame.create(gameData);
        this.casinoGames.set(newGame.id, gameData); // Add the new game log to the collection
        break;
      default:
        return 'INVALID GAME_TYPE';
    }
    this.casinoGames.set(newGame.id, gameData); // Add the new game to the collection
    return newGame; // Return the newly created game log object
  }
  async deleteGame(id, force) {
    const game = this.casinoGames.get(id);

    if (game && force) {
      const affectedRows = await CasinoGame.destroy({ where: { id: id } });

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
  async createGameLog(gameLogData, gameType) {
    let newGameLog;
    gameLogData.id = uuidv4();
    switch (gameType) {
      case gameTypes.BLACKJACK:
        newGameLog = await BJGameLog.create(gameLogData);
        this.gameLog.set(newGameLog.gameLogId, newGameLog); // Add the new game log to the collection
        break;
      case gameTypes.POKER:
        newGameLog = await PokerGameLog.create(gameLogData);
        this.gameLog.set(newGameLog.gameLogId, newGameLog); // Add the new game log to the collection
        break;
      case gameTypes.ROULETTE:
        newGameLog = await RouletteGameLog.create(gameLogData);
        this.gameLog.set(newGameLog.gameLogId, newGameLog); // Add the new game log to the collection
        break;
      default:
        return 'INVALID_GAME_TYPE';
    }
    return newGameLog; // Return the newly created game log object
  }
  async deleteGameLog(id) {
    const gameLog = this.casinoGames.get(id);

    if (gameLog) {
      const affectedRows = await CasinoGameLog.destroy({ where: { id: id } });

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
  async createGameHand(handData, gameType) {
    let newHand;
    handData.id = uuidv4();
    switch (gameType) {
      case gameTypes.BLACKJACK:
        newHand = await BJHand.create(handData);
        break;
      case gameTypes.POKER:
        newHand = await PokerHand.create(handData);
        break;
      default:
        return 'INVALID_GAME_TYPE';

    }
    return newHand;

  }
  async deleteGameHand(id, gameType) {
    let hand;
    switch (gameType) {
      case gameTypes.BLACKJACK:
        hand = await BJHand.destroy({ where: { id: id } });
        break;
      case gameTypes.POKER:
        hand = await PokerHand.destroy({ where: { id: id } });
        break;
      default:
        return 'INVALID_GAME_TYPE';

    }
    return hand; // Return the deleted game log object
  }
  async createGameBet(betData, gameType) {
    let newBet;
    betData.id = uuidv4();
    switch (gameType) {
      case gameTypes.BLACKJACK:
        newBet = await BJBet.create(betData);
        break;
      case gameTypes.POKER:
        newBet = await PokerBet.create(betData);
        break;
      default:
        return 'INVALID_GAME_TYPE';

    }
    return newBet;
  }
  async deleteGameBet(id) {

  }
}
