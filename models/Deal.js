const deck = require('./Deck');
const { error_log } = require('../config');
const { errorMessage } = require('../functions/logHandler');
const ErrorEnum = require('../functions/errorTypes');



const init = () => {
	const theDeck = deck.init();
	const dealer = [],
		player = [];

	for(let i = 0; i < 2; i++) {
		player[i] = theDeck.shift();
		dealer[i] = theDeck.shift();
	}

	return {
		deck: theDeck,
		dealerHand: dealer,
		playerHand: player,
	};
};

const tally = (hand, message) => {
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

};

const playerHit = (state) => {
	state.playerHand.push(state.deck.shift());
	const playerScore = tally(state.playerHand);
	if (playerScore > 21) {
		state.status = 'bust';
	}
	return state;
};

const dealerHit = (state) => {
	let playerScore = tally(state.playerHand);
	let dealerScore = tally(state.dealerHand);

	while(dealerScore < 17) {
		state.dealerHand.push(state.deck.shift());
		dealerScore = tally(state.dealerHand);
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
};


module.exports.init = init;
module.exports.playerHit = playerHit;
module.exports.dealerHit = dealerHit;
module.exports.deck = deck;