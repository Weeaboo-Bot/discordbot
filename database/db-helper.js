const { Player, CasinoGame, CasinoGameLog } = require('../database/models/index');

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
      const newGame = await CasinoGame.create(gameData);
      this.casinoGames.set(newGame.gameId, newGame); // Add the new game to the collection
      return newGame; // Return the newly created game object
    }
    async deleteGame(id) {
      const game = this.casinoGames.get(id);

      if (game) {
        const affectedRows = await CasinoGame.destroy({ where: { gameId: id } });

        if (affectedRows > 0) {
          this.casinoGames.delete(id);
          return game; // Return the deleted game object
        } else {
          throw new Error('No game rows were deleted from the database.');
        }
      } else {
        return null; // Indicate game not found
      }
    }
    async createGameLog(gameLogData) {
      const newGameLog = await CasinoGameLog.create(gameLogData);
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
