

module.exports = class Leaderboard {
    constructor(options = {}) {
        this.leaderboardOptions = options.leaderboardOptions || {};
        this.leaderboard = {};
        this.makeLeaderboard(this.leaderboardOptions);
    }

    makeLeaderboard (leaderboardOptions) {
        const newLeaderboard = {};
        this.leaderboard = newLeaderboardn;
        return this.leaderboard;
    }


    updateLeaderboard() {

    }

    resetLeaderboard() {
        this.makeLeaderboard(this.leaderboardOptions);
        return this;
    }
};