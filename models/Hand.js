var Card = require('./Card');

/**
 * Hand constructor
 */
function Hand() {
    this.cards = new Array();
};

Hand.prototype.limit = 21;

/**
 * Hands can have a card added to them. This simply pushes a card to the collection.
 */
Hand.prototype.add = function(card) {
    if (!card instanceof Card) {
        throw new Error("Tried adding a non card to hand!");
    }
    this.cards.push(card);
};

/**
 * This method scores the current hand and returns the score.
 *
 * We assume the highest value when Aces are present, diminishing value so we don't bust.
 */
Hand.prototype.score = function() {
    var score = 0, aces = 0;

    this.cards.forEach(function(card) {
        if (card.face == 'A') {
            aces++;
        }

        if (card.face == 'J' || card.face == 'Q' || card.face == 'K') {
            // Face cards
            score += 10;
        } else if (card.face == 'A') {
            // Aces
            score += 11; // Optimistically assume high values for aces
        } else {
            // Numeric cards
            score += parseInt(card.face, 10); // Normal cards are worth their face value
        }
    });

    // If the score is above the bust limit, and we've got aces, diminish their values until we're no longer busting
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
};

/**
 * This method displays the hand in a human-readable format
 */
Hand.prototype.toString = function() {
    var string = "";

    this.cards.forEach(function(card) {
        string += card.face + " of " + card.suite + "\n";
    });

    string += "Total Points: " + this.score() + "\n";

    return string;
};

/**
 * This method determins if the current hand is a bust
 */
Hand.prototype.bust = function() {
    return this.score() > this.limit;
};

module.exports = Hand;