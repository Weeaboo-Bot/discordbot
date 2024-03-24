
module.exports = class CasinoUtils {
    constructor() {
        this.validRouletteBets = ['straightUp', 'split', 'street', 'corner', 'fiveNumberBet', 'redBlack', 'evenOdd', 'highLow', 'dozens', 'columns', 'red', 'black'];
    }

    checkChannel(channelId, casinoId) {
        if (channelId != casinoId) {
            return true;
        }
        return false;
    }
    async playerNeedsRegister(msg, id) {
        const isPlayer = await msg.client.dbHelper.isPlayer(id);
        if (isPlayer) {
            return false;
        }
        return true;
    }

    async placeBet(msg, betAmount, gameId, gameType) {
        await msg.client.dbHelper.createGameLog({
            gameId: gameId,
            event: 'PLAYER_PLACED_BET',
            playerId: msg.author.id,
        }, gameType);
        await msg.client.dbHelper.createGameBet({
            gameId: gameId,
            playerId: msg.author.id,
            betAmount: betAmount,
        }, gameType);
    }

    async waitForOption(msg, timeout = 30000, options) {
        let userInput;
        while (!userInput) {
            try {
                const messages = await msg.channel.awaitMessages(m => m.author.id === msg.author.id, { max: 1, time: timeout });
                userInput = messages.first().content;

                if (!['hit', 'stand', 'split'].includes(userInput)) {
                    await msg.say(`Invalid option, Please enter one of ${options.join(',')}`);
                    userInput = null; // Reset to continue the loop
                }
            } catch (error) {
                if (error.name === 'MessageCollectorTimeout') {
                    msg.client.logger.info(`User did not respond in time.`);
                    return null; // Indicate timeout
                } else {
                    msg.client.logger.error('An error occurred:', error);
                    return null; // Indicate other error
                }
            }
        }

        return userInput; // Return the valid integer bet amount
    }

    async waitForBet(msg, timeout = 30000) {
        const currBal = await msg.client.dbHelper.getBalance(msg.author.id);
        await msg.say(`You have ${await msg.client.dbHelper.getBalance(msg.author.id)} tokens. Place your bet (integers only)!`);

        const filter = (m) => m.author.id === msg.author.id && Number.isInteger(parseInt(m.content));

        let betAmount;
        while (!betAmount) {
            try {
                const messages = await msg.channel.awaitMessages(filter, { max: 1, time: timeout });
                const receivedBet = messages.first().content;
                betAmount = parseInt(receivedBet);

                if (!Number.isInteger(betAmount)) {
                    await msg.say(`Invalid bet amount. Please enter an integer.`);
                    betAmount = null; // Reset to continue the loop
                }
            } catch (error) {
                if (error.name === 'MessageCollectorTimeout') {
                    msg.client.logger.info(`User did not respond in time.`);
                    return 0; // Indicate timeout
                } else {
                    msg.client.logger.error('An error occurred:', error);
                    return 0; // Indicate other error
                }
            }
        }
        // Check if input is an integer
        if (!(Number.isInteger(Number(betAmount))) || (isNaN(betAmount)) || (betAmount < 0)) {
            msg.say('Invalid input. Please enter an integer 0 or greater');
            return await this.waitForBet(msg); // Recursive call with return value
        }
        if (betAmount > currBal) {
            msg.say('You do not have enough tokens to place this bet.');
            return await this.waitForBet(msg); // Recursive call with return value
        }

        return betAmount; // Return the valid integer bet amount
    }

    async calcWinUpdateBal(msg, isWin, betAmount, winAmount) {
        if (isWin) {
            return await msg.client.dbHelper.addBalance(msg.author.id, winAmount);
        }
        return await msg.client.dbHelper.removeBalance(msg.author.id, betAmount);
    }

    validateRouletteBet(betInput) {
        return this.validRouletteBets.includes(betInput);
    }
}