const Deck = require('./Deck');
const { error_log } = require('../config');
const { errorMessage } = require('../functions/logHandler');
const ErrorEnum = require('../functions/errorTypes');

module.exports = class Deal {
	constructor() {
		this.theDeck = new Deck();
		this.dealer = [],
		this.player = [];

		for(let i = 0; i < 2; i++) {
			this.player[i] = this.theDeck.shift();
			this.dealer[i] = this.theDeck.shift();
		}

		return {
			deck: this.theDeck,
			dealerHand: this.dealer,
			playerHand: this.player,
		};
	}

	tally(hand, message) {
		let score = 0;
		let numAce = 0;
		for(let i = 0; i < hand.length; i++) {
			if(hand[i].gameVal) {
				score += hand[i].gameVal;
				if(hand[i].gameVal == 11) {
					numAce++;
				}
				for (let j = 0; j < numAce; j++) {
					if(score > 21 && numAce > 0) {
						score -= 10;
						numAce--;
					}
				}
			}
			else {
				message.client.channels.cache.get(error_log).send({ embed: errorMessage(error, ErrorEnum.API, message.command.name) });
				console.log('Something is wrong!');

			}
		}
		return score;
	}

	playerHit(state) {
		state.playerHand.push(state.deck.shift());
		const playerScore = this.tally(state.playerHand);
		if (playerScore > 21) {
			state.status = 'bust';
		}
		return state;
	}

	dealerHit(state) {
		const playerScore = this.tally(state.playerHand);
		let dealerScore = this.tally(state.dealerHand);

		while(dealerScore < 17) {
			state.dealerHand.push(state.deck.shift());
			dealerScore = this.tally(state.dealerHand);
			// += state.dealerHand[state.dealerHand.length - 1].gameVal;
		}

		if(dealerScore > 21 || playerScore > dealerScore) {
			state.status = 'win';

		}
		else if (dealerScore > playerScore) {
			state.status = 'lose';
		}
		else if (dealerScore == playerScore) {
			state.status = 'push';
		}
	}


};
