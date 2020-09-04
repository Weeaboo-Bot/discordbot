const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const { Deal } = require('../../models/Deal');

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
					key: 'currDeck',
					type: 'string',
					prompt: 'Would you like to view the current deck?',
					oneOf: ['yes', 'no'],
				},
				{
					key: 'playerHit',
					type: 'string',
					prompt: 'Would you like to hit?',
					oneOf: ['yes', 'no'],
				},
			],

		});

	}
	run(message, { currDeck, playerHit }) {
		const deal = new Deal(),
			deck = deal.deck,
			playerHand = deal.playerHand,
			dealerHand = deal.dealerHand;

		if(currDeck == 'yes') {
			return message.channel.send('Current Deck: ' + deck.map(deck_val => {
				deck_val.code;
			}));
		}
		if(playerHit == 'yes') {
			// Do player hit
		}

		playerHand.forEach(val => {
			const playerEmbed = new Discord.MessageEmbed()
				.setFooter('Current Player Hand')
				.setDescription(val.code)
				.attachFiles(val.imgSrc)
				.setImage(`attachment://${val.imgSrc}`)
				.setColor('#A187E0');


			return message.channel.send({ embed: playerEmbed });
		});


	}


};
