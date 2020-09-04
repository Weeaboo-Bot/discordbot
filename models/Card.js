function card(cardVal, suit, gameVal, imgSrc) {
	this.cardVal = cardVal;
	this.suit = suit;
	this.gameVal = gameVal;
	this.imgSrc = imgSrc;
}

module.exports.card = card;