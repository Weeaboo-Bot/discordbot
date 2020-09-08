const Command = require('../../models/Command');
const { randomRange, formatNumber } = require('../../helpers/functions');

module.exports = class RandomDiceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'random-dice',
			aliases: ['rand-dice'],
			group: 'games',
			memberName: 'roll',
			description: 'Rolls a dice with a minimum/maximum value of your choice.',
			args: [
				{
					key: 'maxValue',
					label: 'highest number',
					prompt: 'What is the highest number you wish to appear?',
					type: 'integer',
					default: 6,
					min: 1,
					max: Number.MAX_SAFE_INTEGER,
				},
				{
					key: 'minValue',
					label: 'lowest number',
					prompt: 'What is the lowest number you wish to appear?',
					type: 'integer',
					default: 0,
					min: 0,
					max: Number.MAX_SAFE_INTEGER,
				},
			],
		});
	}

	run(msg, { maxValue, minValue }) {
		let result;
		if (minValue) result = randomRange(minValue, maxValue);
		else result = Math.floor(Math.random() * maxValue) + 1;
		return msg.say(`You rolled a ${formatNumber(result)}.`);
	}
};