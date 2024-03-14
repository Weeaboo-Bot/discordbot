const Command = require('../../structures/Command');
const { oneLine } = require('common-tags');

// Generate numbers 0 to 36 correctly
const numbers = Array.from({ length: 37 }, (_, i) => i + 1); // Start from 1

const rouletteOptions = {
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

  run(msg, { spaces }) {
    if (msg.channel.id !== this.client.casinoChannel) { // Replace with the actual channel ID
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
    return rouletteOptions.colors?.red?.includes(number);
  }

  verifyWin(choice, result) {
    const checkOption = (option) => {
      if (rouletteOptions[option].includes(choice)) {
        const range = choice.split('-');
        return result >= range[0] && range[1] >= result;
      }
      return false;
    };

    if (checkOption('dozens') || checkOption('halves')) return true;

    if (rouletteOptions.colors.includes(choice)) {
      return this.isRed(choice) === this.isRed(result);
    }

    if (rouletteOptions.parity.includes(choice)) {
      return rouletteOptions.parity[result % 2] === choice;
    }

    if (rouletteOptions.columns.includes(choice)) {
      return rouletteOptions.columns[(result - 1) % 3] === choice;
    }

    const number = Number.parseInt(choice, 10);
    return number === result;
  }
};
