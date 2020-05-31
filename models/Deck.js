var exports = module.exports = {};
var Card = require('./Card');


var cards;
/**
 * Deck constructor
 *
 * When creating a new deck, we iterate over every known face and suite combination,
 * adding each one to the collection of cards.
 */
var Deck = function() {
    var self = this;
    cards = new Array();
    Card.prototype.suites.forEach(function(suite) {
        Card.prototype.faces.forEach(function(face) {
            cards.push(new Card(face, suite));
        });
    });
};

Deck.prototype.constructor = Deck;

/**
 * Drawing a card simply pops a card from the end of the deck
 */
Deck.prototype.draw = function() {
    return cards.pop();
};

/**
 * Shuffling a deck uses this goofy looking function I found from the Internets.
 */
Deck.prototype.shuffle = function() {
    for (var j, x, i = cards.length; i; j = Math.floor(Math.random() * i), x = cards[--i], cards[i] = cards[j], cards[j] = x);

    return this;
};

module.exports = Deck;