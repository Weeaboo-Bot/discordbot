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
			args: [
				{
					'key': 'currDeck',
					'type': 'String',
					'prompt': 'Would you like to view the current deck?',
				},
				{
					'key': 'playerHit',
					'type': 'String',
					'prompt': 'Player Hits',
				},
			];

		});

	}
	run(message, {currDeck,playerHit}) {


		const deckEmbed = new Discord.MessageEmbed()
			.setColor('#185B92')
			.setTitle('Current Deck')
			.setDescription('This is the current playing deck.')
			deal.deck.init().forEach(val => {
				
			})
			.addField('Deck', deal.deck.init().map(val => {
				return val.code;
			}))
			

			if(currDeck) return message.channel.send('Current Deck', { embed: deckEmbed });


	}


};
