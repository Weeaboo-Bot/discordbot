const Command = require('../../structures/Command');
const { stripIndents } = require('common-tags');
const { verify } = require('../../util/Util');
const Deck = require('../../structures/cards/Deck');
const hitWords = ['hit', 'hit me'];
const standWords = ['stand'];

module.exports = class BlackjackCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'blackjack',
            aliases: ['twenty-one', '21', 'bj'],
            group: 'games-sp',
            memberName: 'blackjack',
            description: 'Play a game of blackjack.',
            args: [
                {
                    key: 'deckCount',
                    label: 'amount of decks',
                    prompt: 'How many decks do you want to use?',
                    type: 'integer',
                    default: 1,
                    max: 8,
                    min: 1,
                },
            ],
        });
    }

    async run(msg, { deckCount }) {
        if (msg.channel.id !== this.client.casinoChannel) { // Replace with the actual channel ID
            return; // Do nothing if channel doesn't match
          }
        const isPlayer = await this.client.dbHelper.isPlayer(msg.author.id);
        if (!isPlayer) {
            return msg.say('You need to register your account before playing!');
        }
        try {
            const { id } = await this.client.dbHelper.createGame({
                data: new Deck({ deckCount }),
            }, 'blackjack');
            msg.say(`Starting new Blackjack Game with ID: ${id}`);
            await this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'PLAYER_JOINED',
                playerId: msg.author.id,
            }, 'blackjack');
            const betAmount = await this.waitForBet(msg);
            this.placeBets(betAmount, id, msg.author.id);
            const dealerHand = [];
            this.draw(id, dealerHand);
            this.draw(id, dealerHand);
            this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'DEALER_DRAWN',
                playerId: '1',
            }, 'blackjack');

            const playerHand = [];
            this.draw(id, playerHand);
            this.draw(id, playerHand);

            const dealerInitialTotal = this.calculate(dealerHand);
            const playerInitialTotal = this.calculate(playerHand);
            this.client.dbHelper.createGameHand({
                gameId: id,
                playerId: '1',
                cards: dealerHand,
                total: dealerInitialTotal,
            }, 'blackjack');
            this.client.dbHelper.createGameHand({
                gameId: id,
                playerId: msg.author.id,
                cards: playerHand,
                total: playerInitialTotal,
            }, 'blackjack');

            let outcome = await this.handleInitialRound(dealerInitialTotal, playerInitialTotal, id, msg.author.id, betAmount);
            if (outcome) {
                msg.say(outcome);
                return msg.say(`Your new token balance is ${await this.client.dbHelper.getBalance(msg.author.id)}`);
            }

            let playerTurn = true;
            let win = false;
            let reason;

            while (!win) {
                if (playerTurn) {
                    outcome = await this.handlePlayerTurn(msg, playerHand, dealerHand, id);
                    if (outcome) {
                        reason = outcome;
                        win = true;
                        break;
                    }
                    playerTurn = false;
                } else {
                    outcome = await this.handleDealerTurn(dealerHand, playerHand, msg, id);
                    if (outcome) {
                        reason = outcome;
                        win = true;
                        break;
                    }
                    playerTurn = true;
                }
            }

            await this.client.dbHelper.deleteGame(id, false);
            if (win) {
                await this.client.dbHelper.createGameLog({
                    gameId: id,
                    event: 'PLAYER_WIN',
                    playerId: msg.author.id,
                }, 'blackjack');
                return msg.reply(`${reason}! You won!, your new token balance is ${await this.client.dbHelper.getBalance(msg.author.id)}`);
            }
            await this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'DEALER_WIN',
                playerId: '1',
            }, 'blackjack');
            await this.client.dbHelper.removeBalance(msg.author.id, betAmount);
            return msg.reply(`${reason}! Too bad, your new token balance is ${await this.client.dbHelper.getBalance(msg.author.id)}`);
        } catch (error) {
            msg.client.botLogger({
                embed: msg.client.errorMessage(
                    msg.client.logger,
                    error,
                    msg.client.errorTypes.DATABASE,
                    msg.command.name
                ),
            });
            this.client.logger.error('Error during blackjack game:', error);
            return msg.say('An error occurred during the game. Please try again later.');
        }
    }
    async handleInitialRound(dealerTotal, playerTotal, id, playerId, betAmount) {
        if (dealerTotal === 21 && playerTotal === 21) {
            await this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'PUSH',
                playerId: playerId,
            }, 'blackjack');
            return 'Well, both of you just hit blackjack. Right away. Rigged.';
        } else if (dealerTotal === 21) {
            await this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'DEALER_BLACKJACK',
                playerId: playerId,
            }, 'blackjack');
            await this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'DEALER_WIN',
                playerId: '1'
            }, 'blackjack');
            await this.client.dbHelper.removeBalance(playerId, betAmount);
            return 'Ouch, the dealer hit blackjack right away! Try again!';
        } else if (playerTotal === 21) {
            await this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'PLAYER_BLACKJACK',
                playerId: playerId,
            }, 'blackjack');
            await this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'PLAYER_WIN',
                playerId: playerId,
            }, 'blackjack');
            await this.client.dbHelper.addBalance(playerId, betAmount * 1.5);
            return 'Wow, you hit blackjack right away! Lucky you!';
        }
        return null;
    }
    async handlePlayerTurn(msg, playerHand, dealerHand, id, betAmount) {
        await msg.say(stripIndents`
          **First Dealer Card:** ${dealerHand[0].display}
      
          **You (${this.calculate(playerHand)}):**
          ${playerHand.map((card) => card.display).join('\n')}
      
          _Hit?_
        `);

        const hit = await verify(msg.channel, msg.author, {
            extraYes: hitWords,
            extraNo: standWords,
        });

        if (hit) {
            await this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'PLAYER_HIT',
                playerId: msg.author.id,
            }, 'blackjack');
            const card = this.draw(id, playerHand);
            const total = this.calculate(playerHand);
            this.client.dbHelper.createGameHand({
                gameId: id,
                playerId: msg.author.id,
                cards: playerHand,
                total: total,
            }, 'blackjack');
            if (total > 21) {
                await this.client.dbHelper.createGameLog({
                    gameId: id,
                    event: 'PLAYER_BUST',
                    playerId: msg.author.id,
                }, 'blackjack');
                await this.client.dbHelper.removeBalance(msg.author.id, betAmount);
                return `You drew ${card.display}, total of ${total}! Bust`;
            } else if (total === 21) {
                await this.client.dbHelper.createGameLog({
                    gameId: id,
                    event: 'PLAYER_WIN',
                    playerId: msg.author.id,
                }, 'blackjack');
                await this.client.dbHelper.addBalance(msg.author.id, betAmount * 1.5);
                return `You drew ${card.display} and hit 21`;
            }
        } else {
            await this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'PLAYER_STAND',
                playerId: msg.author.id,
            });
            const dealerTotal = this.calculate(dealerHand);
            this.client.dbHelper.createGameHand({
                gameId: id,
                playerId: '1',
                cards: dealerHand,
                total: dealerTotal,
            }, 'blackjack');
            await msg.say(`Second dealer card is ${dealerHand[1].display}, total of ${dealerTotal}.`);
        }
        return null; // No outcome determined yet
    }
    async handleDealerTurn(dealerHand, playerHand, msg, id) {
        let card;
        let total = this.calculate(dealerHand);

        while (total < 17) {
            card = this.draw(id, dealerHand);
            total = this.calculate(dealerHand);
            this.client.dbHelper.createGameHand({
                gameId: id,
                playerId: '1',
                cards: dealerHand,
                total: total,
            }, 'blackjack');
            await msg.say(`Dealer drew ${card.display}, total of ${total}.`);
        }

        if (total > 21) {
            await this.client.dbHelper.createGameLog({
                gameId: id,
                event: 'DEALER_BUST',
                playerId: msg.author.id,
            }, 'blackjack');
            return `Dealer drew ${card.display}, total of ${total}! Dealer bust`;
        } else if (total >= 17) {
            const playerTotal = this.calculate(playerHand);
            this.client.dbHelper.createGameHand({
                gameId: id,
                playerId: msg.author.id,
                cards: playerHand,
                total: playerTotal,
            }, 'blackjack');
            if (total === playerTotal) {
                await this.client.dbHelper.createGameLog({
                    gameId: id,
                    event: 'PUSH',
                    playerId: msg.author.id,
                }, 'blackjack')
                return `${card ? `Dealer drew ${card.display}, making it ` : ''}
                    ${playerTotal}-${total}`;
            } else if (total > playerTotal) {
                return `${card ? `Dealer drew ${card.display}, making it ` : ''}
                    ${playerTotal}-**${total}**`;
            } else {
                return `${card ? `Dealer drew ${card.display}, making it ` : ''}
                    **${playerTotal}**-${total}`;
            }
        }

        return null; // No outcome determined yet
    }
    async waitForBet(msg, timeout = 30000) {
        await msg.say(`You have ${await this.client.dbHelper.getBalance(msg.author.id)} tokens. Place your bet!`);
        const filter = (m) => m.author.id === msg.author.id; // Filter for messages from the specified user
        try {
            const messages = await msg.channel.awaitMessages(filter, { max: 1, time: timeout });
            return messages.first().content; // Return the first message received
        } catch (error) {
            if (error.name === 'MessageCollectorTimeout') {
                console.log(`User did not respond in time.`);
            } else {
                console.error('An error occurred:', error);
            }
            return null; // Indicate timeout or other error
        }
    }
    async placeBets(betAmount, id, playerId) {
        await this.client.dbHelper.createGameLog({
            gameId: id,
            event: 'PLAYER_PLACED_BET',
            playerId: playerId,
        }, 'blackjack');
        await this.client.dbHelper.createGameBet({
            gameId: id,
            playerId: playerId,
            betAmount: betAmount,
        }, 'blackjack');
    }
    draw(id, hand) {
        const deck = this.client.casinoGames.get(id).data;
        const card = deck.draw();
        hand.push(card);
        return card;
    }
    calculate(hand) {
        return hand
            .sort((a, b) => a.blackjackValue - b.blackjackValue)
            .reduce((a, b) => {
                let { blackjackValue } = b;
                if (blackjackValue === 11 && a + blackjackValue > 21) {
                    blackjackValue = 1;
                }
                return a + blackjackValue;
            }, 0);
    }
};
