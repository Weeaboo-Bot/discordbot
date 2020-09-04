const Discord = require('discord.js');
const { Command } = require('discord.js-commando');
const deck = require('../../models/Deck');
const ls = require('../../functions/ls');
const { keys } = require('lodash');


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


		const Deck = new deck();
		message.say('Generating new Deck...Please Wait');
		Deck.generate_deck();

		const to_integer = (card) => {
			if(card == 'A') {
				return 11;
			}
			else if(card == 'base') {
				return 0;
			}
			else if(card == 'J' || card == 'Q' || card == 'K') {
				return 10;
			}
			else {
				return Number(card);
			}

		};

		const ace_check = (value, total) => {
			if(total + value > 21 && value == 11) {
				return 1;
			}
			else {
				return value;
			}
		};

		const arrCardCalc = (arr) => {
			let sum = 0;
			let iterations = 0;
			for(const x in arr) {
				sum += arr[iterations].toInteger;
				iterations += 1;
			}
			return [sum, iterations];
		};

		const end_game = (user) => {
			const userLsID = user.id + 'blackjackGame';
			ls.remove(userLsID);
		};

		const user_hit = (user, message, prefix) => {
			const cardsObj = ls.getObj(user.id + 'blackjackGame');
			const card = Deck.deal;
			const total = arrCardCalc(cardsObj.userTotal);
			const newTotal = total[0] + ace_check(card.to_integer, total[0]);
			const userLS = user.id + 'profile';
			const bet = Number(cardsObj.bet);

			message.channel.send(`${user.username} drew ${card.val + '' + card.suite}`);
			if(newTotal > 21) {
				const loss = Number(ls.get(userLS)) - (bet);
				ls.set(userLS, loss);
				end_game(user);
				return `${user.username} busted; Dealer Winds, **${user.username} loses`;
			}
			else if(newTotal == 21 && total[1] == 1) {
				const gain = Number(ls.get(userLS)) + (bet * 2);
				ls.set(userLS, gain);
				end_game(user);
				return `${user.username} has blackjack; **${user.username} wins!, doubled the winning ammount**!`;
			}
			else {
				cardsObj.userTotal.push();
			}
		};


		const deckEmbed = new Discord.MessageEmbed()
			.setColor('#185B92')
			.setTitle('Current Deck')
			.setDescription('This is the current playing deck.')
			.addField('Deck', Deck.deck)


		;

		const x = Deck.deck;


		return message.say('Hello');


	}


};