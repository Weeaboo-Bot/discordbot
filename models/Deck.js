const fs = require('fs');

module.exports = class Deck {
	constructor() {
		this.deck = [];
		this.dealt_cards = [];
	}






	generate_deck() {
		const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		const suits = ['Clubs', 'Diamonds', 'Spades', 'Hearts'];
		const codes = ['C', 'D', 'S', 'H'];

	
		const card = (suit, value, code) => {
			const name = value + ' of ' + suit;
			
			
		

			
            		return { 'name': name, 'suit': suit, 'value': value, 'code': value + code };
       	 	};
  

		

		for (let s = 0; s < suits.length; s++) {
		    for (let v = 0; v < values.length; v++) {


               	this.deck.push(card(suits[s], values[v], codes[s]));
        		}
		}
	}

	
	print_deck() {
		if (this.deck.length === 0) {
			return 'Deck has not been generated. Call generate_deck() on deck object before continuing.';
		}
		else {
			for (let c = 0; c < this.deck.length; c++) {
	       			return this.deck[c];
			}
		}
	}


	shuffle() {
  		for(let c = this.deck.length - 1; c >= 0; c--) {
            		const tempval = this.deck[c];
            		let randomindex = Math.floor(Math.random() * this.deck.length);

			// ensures that the randome index isn't the same as the current index. It runs the function again if this returns as true
            			while(randomindex == c) { randomindex = Math.floor(Math.random() * this.deck.length);}
            		this.deck[c] = this.deck[randomindex];
            		this.deck[randomindex] = tempval;
        	}
	}

	
	deal(num_cards) {

		const cards = [];

		for (let c = 0; c < num_cards; c++) {
			const dealt_card = this.deck.shift();
			cards.push(dealt_card);
			this.dealt_cards.push(dealt_card);
		}

		return cards;
	}

	replace() {
		this.deck.unshift(this.dealt_cards.shift());
	}

	clear_deck() {
		this.deck = [];
	}
};