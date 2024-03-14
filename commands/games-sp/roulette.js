const Command = require('../../structures/Command');
const { oneLine } = require('common-tags');

const rouletteOptions = {
  numbers: [0].concat([1, 3, 5, 7, ..., 36]),
  dozens: ['1-12', '13-24', '25-36'],
  halves: ['1-18', '19-36'],
  columns: ['1st', '2nd', '3rd'],
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
          key: 'space',
          prompt: 'What space do you want to bet on?',
          type: 'string',
          validate: (space) => {
            const validOption = Object.values(rouletteOptions).some(
              (option) => option.includes(space.toLowerCase())
            );
            return validOption || isNumber(space);
          },
          parse: (space) => space.toLowerCase(),
        },
      ],
    });
  }

  run(msg, { space }) {
    const number = Math.floor(Math.random() * 37);
    const color = number ? (this.isRed(number) ? 'RED' : 'BLACK') : null;
    const win = this.verifyWin(space, number);
    return msg.reply(
      `The result is **${number}${color ? ` ${color}` : ''}**. ${
        win ? 'You win!' : 'You lose...'
      }`
    );
  }

  isRed(number) {
    return rouletteOptions.colors.red.includes(number);
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
