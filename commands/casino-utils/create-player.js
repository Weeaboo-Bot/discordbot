const Command = require('../../structures/Command');

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
                    type: 'user',
                    default: (msg) => msg.author,
                },
            ],
        });
    }

    async run(msg, { user }) {
        try {
            if (await msg.client.dbHelper.isPlayer(user.id)) {
                return await msg.reply('This user already exists in the casino');
            }
            await msg.client.casinoUtils.checkForPlayer(user.id);
            const member = msg.guild.members.cache.get(user.id);
            const role = msg.guild.roles.cache.find(role => role.name === 'Casino Player');
            await member.roles.add(role);
            const newPlayer = await msg.client.dbHelper.createPlayer({
                id: user.id,
                userName: user.username,
                userTag: user.tag,
                balance: 1000, // we give everyone 1000 to start 
            });
            msg.client.logger.info(`Successfully added role "${role.name}" to user "${member.user.username}"`);
            return msg.reply(
                `Created new player ${user.tag} with ID ${newPlayer.id} at <t:${msg.client.dbHelper.convertTimestamp(newPlayer.createdAt)}:f>`
            );
        } catch (error) {
            msg.client.botLogger({
                embed: msg.client.errorMessage(
                    msg.client.logger,
                    error,
                    msg.client.errorTypes.DATABASE,
                    msg.command.name
                ),
            });
        }
    }
};
