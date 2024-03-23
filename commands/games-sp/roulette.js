const Command = require('../../structures/Command');

module.exports = class RouletteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roulette',
      group: 'games-sp',
      memberName: 'roulette',
      description: 'Play a game of roulette.',
      args: [
        {
          key: 'bet',
          prompt: `What betType would you like to place? i.e. ${['straightUp', 'split', 'street', 'corner', 'fiveNumberBet', 'redBlack', 'evenOdd', 'highLow', 'dozens', 'columns', 'red', 'black']}`,
          type: 'string',
          validate: (bet) => {
            const betType = bet.split(' ')[0]; // Extract first word (bet type)

            if (this.client.casinoUtils.validateRouletteBet(betType)) {
              return true;
              // Proceed with processing the bet (considering other validations like bet amount)
            } else {
              return (`Please choose from: ${this.client.casinoUtils.validRouletteBets.join(', ')}`);
              // Handle invalid bet type (e.g., send an informative message to the user)
            }
          },
        },
      ],
    });
  }

  async run(msg, { bet }) {
    await msg.client.casinoUtils.checkChannel(msg.channel.id, msg.client.casinoChannel);
    await msg.client.casinoUtils.checkForPlayer(msg.author.id);
    
    try {
      const { id } = await msg.client.dbHelper.createGame({
        data: 'New Roulette Game'
      }, 'roulette');
      msg.say(`Starting new Roulette Game with ID: ${id}`);
      await msg.client.dbHelper.createGameLog({
        gameId: id,
        event: 'PLAYER_JOINED',
        playerId: msg.author.id,
      }, 'roulette');
      const betAmount = await msg.client.casinoUtils.waitForBet(msg);
      await msg.client.casinoUtils.placeBet(msg, betAmount, id, 'roulette');
      await msg.client.dbHelper.createGameLog({
        gameId: id,
        event: 'PLACED_BETS_CLOSED',
        playerId: msg.author.id,
      }, 'roulette');
      msg.say('Bets placed. Game starting...');

      // get winnings
      const winnings = this.calculateRouletteWinnings(msg, bet, betAmount, 'european');
      await msg.client.dbHelper.createGameLog({
        gameId: id,
        event: 'WHEEL_SPUN',
        playerId: msg.author.id,
      }, 'roulette');
      await msg.client.dbHelper.createGameLog({
        gameId: id,
        event: 'BALL_LANDED',
        playerId: msg.author.id,
      }, 'roulette');

      let resultMessage;
      let newBal;

      if (winnings > 0) {
        await msg.client.dbHelper.createGameLog({
          gameId: id,
          event: 'WINNINGS_DISTRIBUTED',
          playerId: msg.author.id,
        }, 'roulette');
        newBal = await msg.client.casinoUtils.calcWinUpdateBal(msg, true, betAmount, winnings)
        resultMessage = `Congratulations! You won ${winnings} on your ${bet} bet.`;
        resultMessage += ` Your new token balance is ${newBal}.`;
      } else {
        newBal = await msg.client.casinoUtils.calcWinUpdateBal(msg, false, betAmount, winnings);
        resultMessage = `Sorry, you didn't win this round.`;
        resultMessage += ` Your new token balance is ${newBal}.`;
      }

      await msg.client.dbHelper.createGameLog({
        gameId: id,
        event: 'GAME_ENDED',
        playerId: msg.author.id,
      }, 'roulette');
      return msg.reply(resultMessage);

    } catch (error) {
      msg.client.botLogger({
        embed: msg.client.errorMessage(
          msg.client.logger,
          error,
          msg.client.errorTypes.DATABASE,
          msg.command.name
        ),
      });
      msg.client.logger.error(error);
      return msg.say('An error occurred during the game. Please try again later.');
    }
  }

  calculateRouletteWinnings(msg, betType, betAmount, rouletteVariant) {
    const payouts = this.getPayouts(rouletteVariant); // Function to retrieve payouts based on variant

    // Check if the bet type exists
    if (!payouts[betType]) {
      throw new Error(`Invalid bet type: ${betType}`);
    }

    const winningNumber = this.getWinningNumber(rouletteVariant); // Get winning number based on variant

    // Check if the outcome matches the bet
    let winnings = 0;
    switch (betType) {
      case 'straightUp':
        winnings = betAmount * payouts[betType] ** (winningNumber === betAmount); // Direct number match using exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber}`);
        break;
      case 'split':
        winnings = betAmount * payouts[betType] ** ([betAmount - 1, betAmount + 1].includes(winningNumber)); // Adjacent numbers, exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber}`);
        break;
      case 'street':
        const streetStart = Math.floor((betAmount - 1) / 3) * 3 + 1; // Calculate street starting number
        winnings = betAmount * payouts[betType] ** ([streetStart, streetStart + 1, streetStart + 2].includes(winningNumber)); // Numbers in the street, exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber}`);
        break;
      case 'corner':
        const cornerRow = Math.floor((betAmount - 1) / 4); // Calculate corner row
        const cornerCol = (betAmount - 1) % 4; // Calculate corner column
        const cornerNumbers = [
          cornerRow * 4 + cornerCol + 1,
          cornerRow * 4 + cornerCol + 2,
          (cornerRow + 1) * 4 + cornerCol + 1,
          (cornerRow + 1) * 4 + cornerCol + 2,
        ];
        winnings = betAmount * payouts[betType] ** (cornerNumbers.includes(winningNumber)); // Numbers in the corner, exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber}`);
        break;
      case 'fiveNumberBet': // American Roulette only
        if (rouletteVariant !== 'american') {
          throw new Error('Five Number Bet is only available in American Roulette');
        }
        winnings = betAmount * payouts[betType] * ([0, 0o0, 1, 2, 3].includes(winningNumber));
        msg.say(`The winning number is ${winningNumber}`);
        break;
      case 'redBlack':
        const winningColor = winningNumber === 0 ? 'green' : (winningNumber % 2 === 0 ? 'black' : 'red');
        winnings = betAmount * payouts[betType] ** (winningColor === betAmount); // Color match, exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber} ${winningColor}`);
        break;
      case 'black':
        winnings = betAmount * payouts[betType] ** (winningNumber === 0); // Zero match, exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber}`);
        break;
      case 'red':
        winnings = betAmount * payouts[betType] ** (winningNumber !== 0 && winningNumber % 2 !== 0); // Red match, exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber}`);
        break;
      case 'evenOdd':
        winnings = betAmount * payouts[betType] ** ((winningNumber % 2 === 0 && betAmount === 'even') || (winningNumber % 2 !== 0 && betAmount === 'odd')); // Even/odd match, exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber}`);
        break;
      case 'highLow':
        const highLowBoundary = 18;
        winnings = betAmount * payouts[betType] ** ((winningNumber >= highLowBoundary && betAmount === 'high') || (winningNumber < highLowBoundary && betAmount === 'low')); // High/low match, exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber}`);
        break;
      case 'dozens':
        const dozen = Math.ceil(winningNumber / 12);
        winnings = betAmount * payouts[betType] ** (dozen === betAmount); // Dozen match, exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber}`);
        break;
      case 'columns':
        const column = Math.ceil(betAmount / 3);
        const columnNumbers = [column, column + 3, column + 6];
        winnings = betAmount * payouts[betType] ** (columnNumbers.includes(winningNumber)); // Column match, exponentiation for boolean conversion
        msg.say(`The winning number is ${winningNumber}`);
        break;
      default:
        throw new Error(`Unhandled bet type: ${betType}`);
    }

    return winnings;
  }
  // Function to retrieve payouts based on roulette variant (implement logic here)
  getPayouts(rouletteVariant) {
    if (rouletteVariant === 'european') {
      return {
        straightUp: 35,
        split: 17,
        street: 11,
        corner: 8,
        redBlack: 1,
        evenOdd: 1,
        highLow: 1,
        dozens: 2,
        columns: 2,
        black: 1,
        red: 1,
      };
    } else if (rouletteVariant === 'american') {
      return {
        // ... include payouts for American Roulette (including fiveNumberBet)
      };
    } else {
      throw new Error(`Unsupported roulette variant: ${rouletteVariant}`);
    }
  }

  getWinningNumber(rouletteVariant) {
    if (rouletteVariant === 'european') {
      // Simulate roulette spin (replace with actual casino API or random number generation logic)
      const winningNumber = Math.floor(Math.random() * 37); // Range 0-36
      return winningNumber;
    } else if (rouletteVariant === 'american') {
      // Simulate roulette spin (replace with actual casino API or random number generation logic)
      const winningNumber = Math.floor(Math.random() * 38); // Range 0-37 (including 00)
      return winningNumber;
    } else {
      throw new Error('Unsupported roulette variant: ' + rouletteVariant);
    }

  }

};