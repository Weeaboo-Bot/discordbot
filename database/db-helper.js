const Sequelize = require('sequelize');
const { Player, PlayerWin, PlayerLoss, CasinoGame, CasinoGameLog } = require('../database/models');

module.exports = class DBHelper {
    constructor(casino, logger, database){
        this.casino = casino;
        this.logger = logger;
    }
    async addBalance(id, amount) {
        const player = this.casino.get(id);

        if (player) {
            player.balance += Number(amount);
            return player.save();
        }
        this.logger.info('Player not found');
    }
    async getBalance(id) {
        const player = this.casino.get(id);
        return player ? player.balance : 0;
    }
    async createPlayer(playerData) {
        const newPlayer = await Player.create(playerData);
        this.casino.set(id, newPlayer);
        return newPlayer;
    }
}