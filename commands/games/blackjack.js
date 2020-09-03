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
	
		}
	
		const ace_check = (value, total) => {
			if(total + value > 21 && value == 11) {
				return 1;
			}
			else {
				return value;
			}
		}

		const arrCardCalc(arr){
			var sum = 0;
			var iterations = 0;
			for(var x in arr){
				sum += arr[iterations].toInteger;
				iterations += 1;
			}
			return [sum, iterations];
		}
	
		const end_game = (user) => {
			var userLsID = user.id + 'blackjackGame';
			ls.remove(userLsID);
		}
	
		const user_hit = (user, message, prefix) => {
			var cardsObj = ls.getObj(user.id + 'blackjackGame');
			var card = Deck.deal;
			var total = arrCardCalc(cardsObj.userTotal);
			var newTotal = total[0] + ace_check(card.to_integer, total[0]);
			var userLS = user.id + 'profile';
			var bet = Number(cardsObj.bet);

			message.channel.send(`${user.username} drew ${card.val + "" + card.suite}`);
			if(newTotal > 21){
				var loss = Number(ls.get(userLS)) - (bet);
				ls.set(userLS, loss);
				end_game(user);
				return `${user.username} busted; Dealer Winds, **${user.username} loses`;
			} else if(newTotal == 21 && total[1] == 1){
				var gain = Number(ls.get(userLS)) + (bet * 2);
				ls.set(userLS, gain);
				end_game(user);
				return `${user.username} has blackjack; **${user.username} wins!, doubled the winning ammount**!`;
			} else {
				cardsObj.userTotal.push()
			}
		}


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