/**
 * Deck.js
 * Contains the Model for a Deck of cards.
 */
const Card = require('./Card');

module.exports = class Deck {
	constructor() {
		this.suits = ['H', 'D', 'C', 'S'],
		this.card_values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
		this.suits_names = ['Hearts', 'Diamonds', 'Clubs', 'Spades'],
		this.cards = [];

		this.initCards();
		this.shuffle();
	}

	initCards() {
		for (let i = 0; i < this.suits.length; i++) {
			for (let x = 0; x < this.card_values.length; x++) {
				const cardNumber = x + i * this.card_values.length;
				this.cards[cardNumber] = new Card(this.card_values[x], this.suits[i], x + 1, './assets/images/deck/' + this.card_values[x] + this.suits[i] + '.png', this.suits_names[i], this.card_values[x] + this.suits[i]);
				if(x > 9) {
					this.cards[cardNumber].gameVal = 10;
				}
				if(x === 0) {
					this.cards[cardNumber].gameVal = 11;
				}
			}
		}
	}

	shuffle() {
		let m = this.cards.length, t, i;
		while(m) {
			i = Math.floor(Math.random() * m--);
			t = this.cards[m];
			this.cards[m] = this.cards[i];
			this.cards[i] = t;
		}
	}
};