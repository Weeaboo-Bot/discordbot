const Command = require('../../structures/Command');
const { oneLine } = require('common-tags');

const rouletteOptions = {
  red: [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
  black: [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
  numbers: Array.from({ length: 37 }, (_, i) => i + 1),
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
    if (msg.channel.id !== this.client.casinoUsersChannel) { // Replace with the actual channel ID
      return; // Do nothing if channel doesn't match
    }
    const number = Math.floor(Math.random() * 37);
    const color = number ? (this.isRed(number) ? 'RED' : 'BLACK') : null;

    const wins = spaces.map((space) => this.verifyWin(space, number));
    const winCount = wins.filter(Boolean).length;

    let resultMessage = `The result is **${number}${color ? ` ${color}` : ''}**. `;
    if (winCount === 0) {
      resultMessage += 'You lose...';
    } else if (winCount === spaces.length) {
      resultMessage += 'You win on all bets!';
    } else {
      resultMessage += `You win on ${winCount} out of ${spaces.length} bets.`;
    }

    return msg.reply(resultMessage);
  }

  isRed(number) {
    return rouletteOptions.red.includes(number);
  }
    
  verifyWin(choice, result) {
    const { red, black, numbers } = rouletteOptions;
  
    // Check for numbers first for efficiency
    if (Number.isInteger(Number.parseInt(choice, 10))) {
      return numbers.includes(choice) && result === choice;
    }
  
    // Check for dozens, halves, and columns (assuming numerical values)
    const rangeCheck = choice.split('-');
    if (rangeCheck.length === 2 && rangeCheck.every(Number.isInteger)) {
      const [min, max] = rangeCheck.map(Number);
      return result >= min && result <= max;
    }
  
    // Check for colors
    if (choice === 'black') {
      return black.includes(result);
    } else if (choice === 'red') {
      return red.includes(result);
    }
  
    // Check for parity
    if (choice === 'even') {
      return result % 2 === 0;
    } else if (choice === 'odd') {
      return result % 2 !== 0;
    }
  
    // Invalid choice
    return false;
  }
};