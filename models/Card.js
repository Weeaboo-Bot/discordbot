module.exports = class Card {
	constructor(cardVal, suit, gameVal, imgSrc, suit_name, code) {
		this.cardVal = cardVal;
		this.suit = suit;
		this.gameVal = gameVal;
		this.imgSrc = imgSrc;
		this.suit_name = suit_name;
		this.code = code;
	}
};