const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');


module.exports = class PokerCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'poker',
            group: 'games',
            memberName: 'poker',
            aliases: ['playpoker','pokergame'],
            description: 'Play a game of 3-Card Poker with the Bot',
            args: [
                {
                    key: 'gameStatus',
                    type: 'string',
                    prompt: 'Please Enter [start] or [stop] to update the game'
                },
                {
                    key: 'anteBet',
                    type: 'string',
                    prompt: 'Please Enter your Ante Bet amount'
                },
                {
                    key: 'pairBet',
                    type: 'string',
                    prompt: 'Please Enter your Pair Plus Bet amount'
                }
            ]
        });
    }
    run(message, {gameStatus,anteBet,pairBet}){




    }
}


