const Command = require('../../structures/Command');
const { MessageEmbed } = require('discord.js');

const validGameTypes = ['blackjack', 'roulette', 'poker'];

module.exports = class GetGameInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'get-game',
            aliases: ['get-casino-game'],
            group: 'casino-utils',
            memberName: 'get-game',
            onwerOnly: true,
            description: 'Get all info about a certain casino game instance',
            args: [
                {
                    key: 'game_id',
                    prompt:
                        'please enter a game UUID',
                    type: 'string',
                },
            ],
        });
    }

    async run(msg, { game_id }) {
        try {
            const game = await this.client.dbHelper.getGame(game_id);
            const gameLogs = await this.client.dbHelper.getGameLog(game_id);
            const embeds = this.createEmbedFromObject(game, gameLogs);
            if (embeds) {
                embeds.forEach((embed) => {
                    msg.say(embed);
                })

            } else {
                return msg.reply('Could not fnd game log');
            }
        } catch (error) {
            msg.client.botLogger({
                embed: msg.client.errorMessage(
                    msg.client.logger,
                    error,
                    msg.client.errorTypes.API,
                    msg.command.name
                ),
            });
        }
    }

    createEmbedFromObject(gameObj, gameLogs) {
        // Create a new embed instance
        const mainEmbed = new MessageEmbed()
        .setTitle('New Casino Game')
        .setDescription('This is a new casino game instance')
        .setColor(0x000000); // Default black

        for (const [key, value] of Object.entries(gameObj)) {
            // Skip properties used for basic embed properties (title, description, color)
            if (['title', 'description', 'color', 'data'].includes(key)) continue;
        
            // Add inline fields by default, adjust as needed
            mainEmbed.addField(key, value, true);
        }

        const subEmbeds = []; // Array to hold sub-embed objects
        if (gameLogs) {
            gameLogs.each((gameLog) => {
                const subEmbed = new MessageEmbed()
                .setTitle('Game Log Data')
                .setDescription('This is the game log data for this game')
                .setColor(0x000000); 

                for (const [key, value] of Object.entries(gameLog)) {
                    // Skip properties used for basic embed properties (title, description, color)
                    if (['title', 'description', 'color', 'data'].includes(key)) continue;
                
                    // Add inline fields by default, adjust as needed
                    subEmbed.addField(key, value, true);
                  }

                subEmbeds.push(subEmbed);
            });
      }

      const allEmbeds = [mainEmbed, ...subEmbeds]; // Combine main and sub-embeds
      return allEmbeds;
    }
};
