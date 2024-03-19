const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');

module.exports = class CreatePlayer extends Command {
    constructor(client) {
        super(client, {
            name: 'create-player',
            aliases: ['create-casino-player'],
            group: 'casino-utils',
            memberName: 'create-player',
            description: 'Create a new Casino Player',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to create in the casino',
                    type: 'member',
                    default: (msg) => msg.author,
                },
            ],
        });
    }

    async run(msg, { user }) {
        try {
            await user.roles.add(msg.guild.roles.cache.find(role => role.name === 'Casino Player'));
            const newPlayer = await msg.client.dbHelper.createPlayer({
                user_id: user.id,
                user_name: user.username,
                user_tag: user.tag,
                bot: user.bot,
                balance: 0,
            });
            msg.client.logger.info(`Successfully added role "${role.name}" to user "${member.user.username}"`);
            return msg.say(
                `Created new player ${user.tag} with ID ${newPlayer.id}`
            );
        } catch (error) {
            msg.client.botLogger({
                embed: message.client.errorMessage(
                    error,
                    message.client.errorTypes.DATABASE,
                    message.command.name
                ),
            });
        }
    }
};
