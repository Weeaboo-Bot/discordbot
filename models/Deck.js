/**
 * Deck.js
 * Contains the Model for a Deck of cards.
 */
const card = require('./Card');

// init the deck of cards
const init = () => {
	const suits = ['H', 'D', 'C', 'S'],
		card_values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
		suits_names = ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
		deck = [];
	let count = 0;

	function initCards() {
		for (let i = 0; i < suits.length; i++) {
			for (let x = 0; x < card_values.length; x++) {
				deck[count] = new card.card(card_values[x], suits[i], x + 1, '/assets/images/deck/' + card_values[x] + suits[i] + '.png', suits_names[i], card_values[x] + suits[i]);
				if(x > 9) {
					deck[count].gameVal = 10;
				}
				if(x === 0) {
					deck[count].gameVal = 11;
				}
				count++;

			}
		}
	}

	function shuffle() {
		let m = deck.length, t, i;
		while(m) {
			i = Math.floor(Math.random() * m--);
			t = deck[m];
			deck[m] = deck[i];
			deck[i] = t;

		}
	}

	initCards();
	shuffle();
	return deck;


};

module.exports.init = init;