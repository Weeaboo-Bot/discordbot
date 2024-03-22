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
        // if (msg.channel.id !== this.client.casinoUsersChannel) { // Replace with the actual channel ID
        //     return; // Do nothing if channel doesn't match
        // }
        const currentGame = this.client.games.get(msg.channel.id);
        if (currentGame) {
            return msg.reply(
                `Please wait until the current game of \`${currentGame.name}\` is finished.`
            );
        }
        try {
            const gameId = await this.client.dbHelper.createGame({
                name: this.name,
                data: new Deck({ deckCount }),
                gameType: 'blackjack',
            });
            const dealerHand = [];
            this.draw(gameId, dealerHand);
            this.draw(gameId, dealerHand);
            const playerHand = [];
            this.draw(gameId, playerHand);
            this.draw(gameId, playerHand);
            const dealerInitialTotal = this.calculate(dealerHand);
            const playerInitialTotal = this.calculate(playerHand);
            if (dealerInitialTotal === 21 && playerInitialTotal === 21) {
                await this.client.dbHelper.deleteGame(gameId, false);
                return msg.say(
                    'Well, both of you just hit blackjack. Right away. Rigged.'
                );
            } else if (dealerInitialTotal === 21) {
                await this.client.dbHelper.deleteGame(gameId, false);
                return msg.say(
                    'Ouch, the dealer hit blackjack right away! Try again!'
                );
            } else if (playerInitialTotal === 21) {
                await this.client.dbHelper.deleteGame(gameId, false);
                return msg.say('Wow, you hit blackjack right away! Lucky you!');
            }
            let playerTurn = true;
            let win = false;
            let reason;
            while (!win) {
                if (playerTurn) {
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
                        const card = this.draw(gameId, playerHand);
                        const total = this.calculate(playerHand);
                        if (total > 21) {
                            reason = `You drew ${card.display}, total of ${total}! Bust`;
                            break;
                        } else if (total === 21) {
                            reason = `You drew ${card.display} and hit 21`;
                            win = true;
                        }
                    } else {
                        const dealerTotal = this.calculate(dealerHand);
                        await msg.say(
                            `Second dealer card is ${dealerHand[1].display}, total of ${dealerTotal}.`
                        );
                        playerTurn = false;
                    }
                } else {
                    const inital = this.calculate(dealerHand);
                    let card;
                    if (inital < 17) card = this.draw(gameId, dealerHand);
                    const total = this.calculate(dealerHand);
                    if (total > 21) {
                        reason = `Dealer drew ${card.display}, total of ${total}! Dealer bust`;
                        win = true;
                    } else if (total >= 17) {
                        const playerTotal = this.calculate(playerHand);
                        if (total === playerTotal) {
                            reason = `${card
                                ? `Dealer drew ${card.display}, making it `
                                : ''
                                }${playerTotal}-${total}`;
                            break;
                        } else if (total > playerTotal) {
                            reason = `${card
                                ? `Dealer drew ${card.display}, making it `
                                : ''
                                }${playerTotal}-**${total}**`;
                            break;
                        } else {
                            reason = `${card
                                ? `Dealer drew ${card.display}, making it `
                                : ''
                                }**${playerTotal}**-${total}`;
                            win = true;
                        }
                    } else {
                        await msg.say(
                            `Dealer drew ${card.display}, total of ${total}.`
                        );
                    }
                }
            }
            await this.client.dbHelper.deleteGame(gameId, false);
            if (win) return msg.say(`${reason}! You won!`);
            return msg.say(`${reason}! Too bad.`);
        } catch (err) {
            await this.client.dbHelper.deleteGame(gameId, true); // we full delete on error 
            msg.client.botLogger({
                embed: msg.client.errorMessage(
                    err,
                    msg.client.errorTypes.DATABASE,
                    msg.command.name
                ),
            });
        }
    }

    async playBlackjack(msg) {
        try {
            const gameId = await this.client.dbHelper.createGame({
                name: this.name,
                data: new Deck({ deckCount }),
                gameType: 'blackjack',
            });

            const dealerHand = [];
            this.draw(gameId, dealerHand);
            this.draw(gameId, dealerHand);

            const playerHand = [];
            this.draw(gameId, playerHand);
            this.draw(gameId, playerHand);

            const dealerInitialTotal = this.calculate(dealerHand);
            const playerInitialTotal = this.calculate(playerHand);

            let outcome = await this.handleInitialRound(dealerInitialTotal, playerInitialTotal, msg);
            if (outcome) {
                await this.client.dbHelper.deleteGame(gameId, false);
                return msg.say(outcome);
            }

            let playerTurn = true;
            let win = false;
            let reason;

            while (!win) {
                if (playerTurn) {
                    outcome = await this.handlePlayerTurn(msg, playerHand);
                    if (outcome) {
                        reason = outcome;
                        win = true;
                        break;
                    }
                    playerTurn = false;
                } else {
                    outcome = await this.handleDealerTurn(dealerHand, msg);
                    if (outcome) {
                        reason = outcome;
                        win = true;
                        break;
                    }
                    playerTurn = true;
                }
            }

            await this.client.dbHelper.deleteGame(gameId, false);
            return win ? msg.say(`${reason}! You won!`) : msg.say(`${reason}! Too bad.`);
        } catch (error) {
            msg.client.botLogger({
                embed: msg.client.errorMessage(
                    error,
                    msg.client.errorTypes.DATABASE,
                    msg.command.name
                ),
            });
            this.client.logger.error('Error during blackjack game:', error);
            return msg.say('An error occurred during the game. Please try again later.');
        }
    }

    async handleInitialRound(dealerTotal, playerTotal) {
        if (dealerTotal === 21 && playerTotal === 21) {
            return 'Well, both of you just hit blackjack. Right away. Rigged.';
        } else if (dealerTotal === 21) {
            return 'Ouch, the dealer hit blackjack right away! Try again!';
        } else if (playerTotal === 21) {
            return 'Wow, you hit blackjack right away! Lucky you!';
        }
        return null;
    }

    async  handlePlayerTurn(msg, playerHand) {
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
          const card = this.draw(gameId, playerHand);
          const total = this.calculate(playerHand);
          if (total > 21) {
            return `You drew ${card.display}, total of ${total}! Bust`;
          } else if (total === 21) {
            return `You drew ${card.display} and hit 21`;
          }
        } else {
          const dealerTotal = this.calculate(dealerHand);
          await msg.say(`Second dealer card is ${dealerHand[1].display}, total of ${dealerTotal}.`);
        }
    
        this.client.dbHelper.createGameLog()
        return null; // No outcome determined yet
      }
      

    async handleDealerTurn(dealerHand, msg) {
        let card;
        let total = this.calculate(dealerHand);
      
        while (total < 17) {
          card = this.draw(gameId, dealerHand);
          total = this.calculate(dealerHand);
          await msg.say(`Dealer drew ${card.display}, total of ${total}.`);
        }
      
        if (total > 21) {
          return `Dealer drew ${card.display}, total of ${total}! Dealer bust`;
        } else if (total >= 17) {
          const playerTotal = this.calculate(playerHand);
          if (total === playerTotal) {
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

    draw(gameId, hand) {
        const deck = this.client.games.get(gameId).data;
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
