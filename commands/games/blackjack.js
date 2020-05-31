const {Command} = require('discord.js-commando');
const Discord = require('discord.js');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');
const log = require('../../functions/consoleLogging');
const lodash = require('lodash');
const Deck = require('../../models/Deck');
const Hand = require('../../models/Hand');

function BlackJack(bet, callback) {
    this.bet = bet;

    // Create a new deck and shuffle it
    this.deck = new Deck().shuffle();

    // Create a new hand for the player
    this.player = new Hand();

    // Create a new hand for the House
    this.house = new Hand();

    // The player draws two cards from the deck
    this.player.add(this.deck.draw());
    this.player.add(this.deck.draw());
//
//  // House gets a card
    this.house.add(this.deck.draw());
//  console.log(this.house.toString());
    // Report the Hands delt
    var playerStr = this.player.toString();
    var houseStr = this.house.toString();

    // House gets a card hidden to the player
    this.house.add(this.deck.draw());

    return callback(playerStr,houseStr);
}

// Deal or House plays. 0 = playing, 1 = player win, 2 = house win
BlackJack.prototype.play = function(hit, callback) {
    console.log("Doing a play");
    if (hit) {
        console.log("Player Hit");
        this.player.add(this.deck.draw());
        var s = "";
        console.log(this.player.bust());
        if (this.player.bust()) {
            console.log("Player Busted on Hit");
            s = "BUST\n" + this.player.toString();
            return callback(2, s);
        } else {
            s = "\n" + this.player.toString();
            return callback(0, s);
        }
    } else {
        console.log("Player stayed");
        s = "STAYING\n" + this.player.toString();
        console.log("House score: " + this.house.score());
        if(this.house.score() > this.player.score() && !this.house.bust()) {
            s = "\nYou lost!\nYour hand: \n" + this.player.toString() + "\nHouses Hand: \n" + this.house.toString();
            return callback(2, s);
        }
        while(!this.house.bust() && this.house.score() <= this.player.score()) {
            console.log("House draw");
            this.house.add(this.deck.draw());
            s = "\nHouse Drew Another\n" + this.house.toString();

            if(this.house.bust()) {
                console.log("House bust");
                s = "\nYou win!\nYour hand: \n" + this.player.toString() + "\nHouses Hand: \n" + this.house.toString();
                return callback(1, s);
            }

            if(!this.house.bust() && this.house.score() > this.player.score()) {
                console.log("House won");
                s = "\nYou lost!\nYour hand: \n" + this.player.toString() + "\nHouses Hand: \n" + this.house.toString();
                return callback(2, s);
            }
        }
    }
}

module.exports = class BlackJackCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'blackjack',
            description: 'Play a game of BlackJack with the Bot',
            group: 'games',
            memberName: 'blackjack',
            aliases: ['playblackjack','blackjackgame'],
            args: [
                {
                    key: 'gameStatus',
                    type: 'string',
                    prompt: 'Please Enter [start] or [stop] to update the game'
                },
                {
                    key: 'bet',
                    type: 'string',
                    prompt: 'Please enter a bet'
                }
            ]
        });



    }
    async run(message, {gameStatus, bet}){

        if(gameStatus == "start") {
            //Start the game


            const bj = new BlackJack(bet, function (playerStr, houseStr) {
                return message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setTitle('Discord Blackjack')
                        .addField('Player Hand', playerStr)
                        .addField('House Hand', houseStr)
                });

            });




            const collector = new Discord.MessageCollector(message.channel, m => m.author.id == message.author.id, { time: 10000});
            collector.on('collect', message => {
                if(message.content == "bjhit"){
                    bj.play(true,function(hitStatus,hitString){
                        switch (hitStatus) {
                            case 0:
                                return message.channel.send('Game Running' + hitString);
                            case 1:
                                return message.channel.send('Player Wins' + hitString);
                            case 2:
                                return message.channel.send('Dealer Wins' + hitString);

                        }
                    })
                }
            })





            // const startMessage = new Discord.MessageEmbed()
            //     .setTitle('Discord Blackjack')
            //     .addField('Game State',gameStatus)
            //     .addField('Current Hand', gameString);
            //
            // message.channel.send({embed: startMessage});





        } else {
            //Stop the game
        }

    }

}