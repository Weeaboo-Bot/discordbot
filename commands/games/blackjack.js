const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const deal = require('../../models/Deal');

module.exports = class BlackJackCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'blackjack',
			group: 'games',
			memberName: 'blackjack',
			aliases: ['bj', '21'],
			description: 'Play BlackJack with other server members, and the bot as dealer!',

		});

	}
	run(message) {


		const deckEmbed = new Discord.MessageEmbed()
			.setColor('#185B92')
			.setTitle('Current Deck')
			.setDescription('This is the current playing deck.')
			.addField('Deck', deal.deck.init().map(val => {
				return val;
			}));

		return message.channel.send('Current Deck', { embed: deckEmbed });


	}


};
