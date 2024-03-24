const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');
const Deck = require('../../structures/cards/Deck');

module.exports = class BlackjackCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'blackjack',
            aliases: ['twenty-one', '21', 'bj'],
            group: 'games-sp',
            memberName: 'blackjack',
            description: 'Play a game of blackjack.',
        });
    }

    async run(msg) {
        if (await this.client.casinoUtils.checkChannel(msg.channel.id, msg.client.casinoChannel)) {
            return msg.reply('Please use this command in a casino channel.');
          }
          if (await this.client.casinoUtils.playerNeedsRegister(msg, msg.author.id)) {
            return msg.reply(`You need to register your account before playing!, run ${msg.client.prefix}create-player`);
          }
        try {
            const { id } = await msg.client.dbHelper.createGame({
                data: new Deck(),
            }, 'blackjack');
            msg.say(`Starting new Blackjack Game with ID: ${id}`);
            await msg.client.dbHelper.createGameLog({
                gameId: id,
                event: 'PLAYER_JOINED',
                playerId: msg.author.id,
            }, 'blackjack');
            const betAmount = await msg.client.casinoUtils.waitForBet(msg);
            await msg.client.casinoUtils.placeBet(msg, betAmount, id, 'blackjack');
            const deck = msg.client.casinoGames.get(id).data;

            const dealerHand = [];
            const playerHand = [];
            const { dealerInitialTotal, playerInitialTotal } = this.handleFirstDraw(msg,id, playerHand, dealerHand, deck)

            let outcome = await this.handleInitialRound(msg, dealerInitialTotal, playerInitialTotal, id, msg.author.id, betAmount);
            if (outcome) {
                msg.say(outcome);
                return msg.say(`Your new token balance is ${await msg.client.dbHelper.getBalance(msg.author.id)}`);
            }

            await this.playPlayerTurn(msg, deck, playerHand, dealerHand, id, betAmount);
        } catch (error) {
            msg.client.botLogger({
                embed: msg.client.errorMessage(
                    msg.client.logger,
                    error,
                    msg.client.errorTypes.DATABASE,
                    msg.command.name
                ),
            });
            msg.client.logger.error('Error during blackjack game:', error);
            return msg.say('An error occurred during the game. Please try again later.');
        }
    }
    async handleInitialRound(msg, dealerTotal, playerTotal, id, playerId, betAmount) {
        if (dealerTotal === 21 && playerTotal === 21) { // PUSH
            await msg.client.dbHelper.createGameLog({
                gameId: id,
                event: 'PUSH',
                playerId: playerId,
            }, 'blackjack');
            return 'Well, both of you just hit blackjack. Right away. Rigged.';
        } else if (dealerTotal === 21) { // Dealer BJ
            await msg.client.dbHelper.createGameLog({
                gameId: id,
                event: 'DEALER_BLACKJACK',
                playerId: playerId,
            }, 'blackjack');
            await msg.client.dbHelper.createGameLog({
                gameId: id,
                event: 'DEALER_WIN',
                playerId: '1'
            }, 'blackjack');
            await msg.client.casinoUtils.calcWinUpdateBal(msg, 0, betAmount, false);
            return 'Ouch, the dealer hit blackjack right away! Try again!';
        } else if (playerTotal === 21) { // Player BJ
            await msg.client.dbHelper.createGameLog({
                gameId: id,
                event: 'PLAYER_BLACKJACK',
                playerId: playerId,
            }, 'blackjack');
            await msg.client.dbHelper.createGameLog({
                gameId: id,
                event: 'PLAYER_WIN',
                playerId: playerId,
            }, 'blackjack');
            await msg.client.casinoUtils.calcWinUpdateBal(msg, betAmount * 2, betAmount, true);
            return 'Wow, you hit blackjack right away! Lucky you!';
        }
        return null;
    }
    async playPlayerTurn(msg, deck, playerHand, dealerHand, gameId, betAmount) {
        let isPlaying = true;
        let canSplit = this.checkSplitPossibility(playerHand);

        const embed = new MessageEmbed() // Create a new embed for messages
            .addField('Player Hand', `${playerHand.map(card => card.textDisplay).join(',')} (${this.calculate(playerHand)})`)
            .addField('Dealer Hand', `${dealerHand[0].textDisplay} (hidden)  ?`)
            .setFooter(gameId);

        const sentMessage = await msg.channel.send(embed); // Send initial embed message

        while (isPlaying) {
            await msg.say('Please enter one of the following options [hit, stand]');
            const response = await msg.channel.awaitMessages(m => m.author.id === msg.author.id, { max: 1, time: 30000 });
            const playerAction = response.first().content.toLowerCase();

            if (playerAction === 'hit') {
                await msg.client.dbHelper.createGameLog({ gameId, event: 'PLAYER_HIT', playerId: msg.author.id }, 'blackjack');
                this.draw(deck, playerHand);
                const playerScore = this.calculate(playerHand);
                await msg.client.dbHelper.createGameHand({
                    gameId,
                    playerId: msg.author.id,
                    cards: playerHand,
                    total: playerScore,
                }, 'blackjack');
                if (playerScore > 21) {
                    isPlaying = false;
                    embed.setTitle('You Lose!');
                    // Log dealer win event
                    await msg.client.dbHelper.createGameLog({ gameId, event: 'PLAYER_BUST', playerId: msg.author.id }, 'blackjack');
                    await msg.client.dbHelper.createGameLog({ gameId, event: 'DEALER_WIN', playerId: msg.author.id }, 'blackjack');
                } else if (playerScore == 21) {
                    isPlaying = false;
                    embed.setTitle('You Win!');
                    // Log player win event
                    await msg.client.dbHelper.createGameLog({ gameId, event: 'PLAYER_WIN', playerId: msg.author.id }, 'blackjack');
                } else {
                    embed.fields[0].value = `${playerHand.map(card => card.textDisplay).join(',')} (${this.calculate(playerHand)})`;
                    await sentMessage.edit(embed);
                }
            } else if (playerAction === 'stand') {
                await msg.client.dbHelper.createGameLog({ gameId, event: 'PLAYER_STAND', playerId: msg.author.id }, 'blackjack');
                isPlaying = false;
            } else if (playerAction === 'split' && canSplit) {
                await msg.channel.send('Split is not currently implemented');
                // if (playerHand.length !== 2) {
                //     await msg.channel.send('Splitting is only allowed for initial two cards of the same value.');
                //     continue;
                // }
                // return await this.handleSplit(msg, deck, playerHand, dealerHand, betAmount, gameId); // Call handleSplit with logging params
            } else {
                await msg.channel.send('Invalid action. Please enter "hit", "stand"');
            }
        }

        // Play dealer turn after player finishes
        const dealerScore = await this.playDealerTurn(deck, dealerHand);
        const playerScore = this.calculate(playerHand);
        await msg.client.dbHelper.createGameHand({
            gameId,
            playerId: '1',
            cards: dealerHand,
            total: dealerScore,
        }, 'blackjack');
        if (dealerScore > 21) {
            await msg.client.dbHelper.createGameLog({ gameId, event: 'DEALER_BUST', playerId: msg.author.id }, 'blackjack');
        }
        embed.fields[0].value = `${playerHand.map(card => card.textDisplay).join(',')} (${playerScore})`;
        embed.fields[1].value = `${dealerHand.map(card => card.textDisplay).join(',')} (${dealerScore})`;
        const winner = (playerScore > 21) ? 'Dealer Wins!' : (dealerScore > 21) ? 'You Win!' : (dealerScore > playerScore) ? 'Dealer Wins!' : 'Push!';
        embed.setTitle(winner);
        await sentMessage.edit(embed);

        if (winner === 'Dealer Wins!') {
            // Log dealer win event after confirming outcome
            await msg.client.dbHelper.createGameLog({ gameId, event: 'DEALER_WIN', playerId: msg.author.id }, 'blackjack');
            await msg.client.casinoUtils.calcWinUpdateBal(msg, false, betAmount, betAmount);
            return msg.reply(`You lost!, your new token balance is ${await msg.client.dbHelper.getBalance(msg.author.id)}`);
        } else if (winner === 'You Win!') {
            let winAmount;
            // Calculate win amount based on bet and blackjack payout (optional)
            if (this.calculate(playerHand) === 21 && playerHand.length === 2) { // Check for Blackjack
                winAmount = betAmount * 2.5; // Hypothetical 3:2 payout for Blackjack
            } else {
                winAmount = betAmount; // Hypothetical 1:1 payout for regular win
            }
            // You can optionally add logic here to log a player win event
            await msg.client.dbHelper.createGameLog({ gameId, event: 'PLAYER_WIN', playerId: msg.author.id }, 'blackjack');
            await msg.client.casinoUtils.calcWinUpdateBal(msg, true, betAmount, winAmount);
            return msg.reply(`You won!, your new token balance is ${await msg.client.dbHelper.getBalance(msg.author.id)}`);
        } else if (winner === 'Push!') {
            // You can optionally add logic here to log a push event
            await msg.client.dbHelper.createGameLog({ gameId, event: 'PUSH', playerId: msg.author.id }, 'blackjack');
            return msg.reply(`It's a push, your new token balance is ${await msg.client.dbHelper.getBalance(msg.author.id)}`);
        }

        return winner; // Optionally return the winner result
    }
    playDealerTurn(deck, dealerHand) {
        let dealerScore = this.calculate(dealerHand);
        while (dealerScore < 17) {
            this.draw(deck, dealerHand);
            dealerScore = this.calculate(dealerHand);
        }
        return dealerScore;
    }
    handleFirstDraw(msg, id, playerHand, dealerHand, deck) {
        this.draw(deck, dealerHand);
        this.draw(deck, dealerHand);
        msg.client.dbHelper.createGameLog({
            gameId: id,
            event: 'DEALER_DRAWN',
            playerId: '1',
        }, 'blackjack');
        this.draw(deck, playerHand);
        this.draw(deck, playerHand);
        const dealerInitialTotal = this.calculate(dealerHand);
        const playerInitialTotal = this.calculate(playerHand);
        msg.client.dbHelper.createGameHand({
            gameId: id,
            playerId: '1',
            cards: dealerHand,
            total: dealerInitialTotal,
        }, 'blackjack');
        msg.client.dbHelper.createGameHand({
            gameId: id,
            playerId: msg.author.id,
            cards: playerHand,
            total: playerInitialTotal,
        }, 'blackjack');
        return { dealerInitialTotal, playerInitialTotal };
    }
    checkSplitPossibility(hand) {
        return hand.length === 2 && hand[0][0] === hand[1][0]; // Check for initial two cards of the same value
    }
    async handleSplit(message, deck, playerHand, dealerHand, betAmount, gameId) {
        const splitCard = playerHand.pop(); // Remove the card to be split
        const secondHand = [splitCard, deck.deck.pop()]; // Create the second hand with the split card and a new card from the deck

        // Play the turn for the first hand (use recursion)
        const firstHandResult = await this.playPlayerTurn(message, deck, playerHand, dealerHand, gameId, betAmount); // Create a copy of the deck for Hand 1

        // Play the turn for the second hand (use recursion)
        const secondHandResult = await this.playPlayerTurn(message, secondHand, dealerHand, gameId, betAmount);

        // Combine the results to determine the overall winner (optional)
        let winner;
        if (firstHandResult === 'You Win!' && secondHandResult === 'You Win!') {
            winner = 'You Win Both Hands!';
        } else if (firstHandResult === 'Dealer Wins!' || secondHandResult === 'Dealer Wins!') {
            winner = 'Dealer Wins!';
        } else {
            winner = 'Push'; // If one hand wins and the other pushes or loses
        }

        return winner; // Return the final winner result
    }
    draw(deck, hand) {
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
    generatePlayerHandText(playerHand) {
        let playerStr = '';
        playerHand.forEach((card) => {
            playerStr += `${card.textDisplay}`
        });
        return playerStr;
    }
    convertToSuitAbbreviation(suit) {
        const suitMap = {
          "Hearts": "H",
          "Diamonds": "D",
          "Spades": "S",
          "Clubs": "C"
        };
      
        return suitMap[suit] || suit; // Return original value if not a known suit
    }
    convertValueToAbbreviation(card) {
        const faceCardMap = {
          "Jack": "J",
          "Queen": "Q",
          "King": "K"
        };
      
        return faceCardMap[card] || card; // Return original value if not a face card
    }
    getCardImage(card) {
        const suit = this.convertToSuitAbbreviation(card.suit);
        const value = this.convertValueToAbbreviation(card.value);
        return `../assets/images/deck/${suit}${value}.png`;
    }
};
