const Deck = require('./Deck');
const { error_log } = require('../../config');
const { errorMessage } = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');

module.exports = class Deal {
	constructor() {
		this.deck = new Deck().cards;
		this.dealer = [],
		this.player = [];
		this.status = '';

		for(let i = 0; i < 2; i++) {
			this.player[i] = this.deck.shift();
			this.dealer[i] = this.deck.shift();
		}
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
				message.client.channels.cache.get(error_log).send({ embed: errorMessage('Error', ErrorEnum.API, message.command.name) });
				console.log('Something is wrong!');

			}
		}
		return score;
	}

	playerHit() {
		this.player.push(this.deck.shift());
		const playerScore = this.tally(this.player);
		if (playerScore > 21) {
			this.status = 'bust';
		}
		return this;
	}

	dealerHit() {
		const playerScore = this.tally(this.player);
		let dealerScore = this.tally(this.dealer);

		while(dealerScore < 17) {
			this.dealer.push(this.deck.shift());
			dealerScore = this.tally(this.dealer);
			// += state.dealerHand[state.dealerHand.length - 1].gameVal;
		}

		if(dealerScore > 21 || playerScore > dealerScore) {
			this.status = 'win';

		}
		else if (dealerScore > playerScore) {
			this.status = 'lose';
		}
		else if (dealerScore == playerScore) {
			this.status = 'push';
		}
	}


};
