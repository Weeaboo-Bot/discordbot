const Command = require('../../structures/Command');
const { oneLine } = require('common-tags');

// Generate numbers 0 to 36 correctly
const numbers = Array.from({ length: 37 }, (_, i) => i + 1); // Start from 1

const rouletteOptions = {
  red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
  numbers, // Use the generated array
  dozens: ['1-12', '13-24', '25-36'],
  halves: ['1-18', '19-36'],
  columns: ['1', '2', '3'], // Change to numerical values for consistency
  parity: ['even', 'odd'],
  colors: ['red', 'black'],
};

const isNumber = (choice) => !isNaN(Number.parseInt(choice, 10));

module.exports = class RouletteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roulette',
      group: 'games-sp',
      memberName: 'roulette',
      description: 'Play a game of roulette.',
      args: [
        {
          key: 'spaces',
          prompt: 'What spaces do you want to bet on (separated by commas)?',
          type: 'string',
          validate: (spaces) => {
            const allValid = spaces.split(',').every((space) => {
              const validOption = Object.values(rouletteOptions).some(
                (option) => option.includes(space.toLowerCase())
              );
              return validOption || isNumber(space);
            });
            return allValid || oneLine`
              Invalid spaces provided, please enter a comma-separated list of valid options. Valid options include:
              * Numbers (e.g. 5, 17)
              * Dozens (e.g. 1-12, 25-36)
              * Halves (e.g. 1-18, 19-36)
              * Columns (e.g. 1st, 2nd, 3rd)
              * Parity (e.g. even, odd)
              * Colors (e.g. red, black)
            `;
          },
          parse: (spaces) => spaces.split(',').map((space) => space.toLowerCase()),
        },
      ],
    });
  }

  async run(msg, { spaces }) {
    // Early return for invalid channels
    if (msg.channel.id !== this.client.casinoChannel) return;
  
    // Generate the winning number
    const winningNumber = Math.floor(Math.random() * 37);
  
    // Determine winning color directly (conditional logic)
    const winningColor = winningNumber <= 18 ? 'RED' : 'BLACK';
  
      const winningBets = spaces.filter((space) => this.verifyWin(space, winningNumber));
      const winCount = winningBets.length;
    
      // Construct the result message with clear formatting, adding win details
      let resultMessage = `The result is **${winningNumber} ${winningColor}**.\n`;

      resultMessage += winCount === 0 ? 'You lose...' :
                       winCount === spaces.length ? 'You win on all bets!' :
                       `You win on ${winCount} out of ${spaces.length} bets. Winning bets: ${JSON.stringify(winningBets)}`;
    
      // Reply with the crafted message
      return msg.reply(resultMessage);
    }
    

  isRed(number) {
    return rouletteOptions.red.includes(number);
  }

  verifyWin(choice, result) {
    // Early return for invalid results (improves readability)
    if (!result) return false;
  
    // Handle numbers directly
    const number = Number.parseInt(choice, 10);
    if (!isNaN(number) && rouletteOptions.numbers.includes(number)) {
      return number === result;
    }
  
    if (choice === 'red') {
      return this.isRed(result);
    } else if (choice === 'black') {
      return !this.isRed(result);
    }
  
    // Leverage existing logic for dozens, halves, parity, and columns
    const optionsToCheck = ['dozens', 'halves', 'parity', 'columns'];
    for (const option of optionsToCheck) {
      if (rouletteOptions[option].includes(choice)) {
        const range = choice.split('-');
        return result >= range[0] && range[1] >= result;
      }
    }
  
    // No match found
    return false;
  }
  
};
