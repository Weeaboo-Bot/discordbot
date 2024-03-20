const Command = require('../../structures/Command');

module.exports = class DeletePlayer extends Command {
    constructor(client) {
        super(client, {
            name: 'delete-player',
            aliases: ['delete-casino-player'],
            group: 'casino-utils',
            memberName: 'delete-player',
            description: 'Create a new Casino Player',
            ownerOnly: true,
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to delete in the casino',
                    type: 'user',
                    default: (msg) => msg.author,
                },
            ],
        });
    }

    async run(msg, { user }) {
        try {
            const member = msg.guild.members.cache.get(user.id);
            const role = msg.guild.roles.cache.find(role => role.name === 'Casino Player');
            await member.roles.remove(role);
            const deletedPlayer = await msg.client.dbHelper.deletePlayer(user.id);
            msg.client.logger.info(`Successfully removed role "${role.name}" from user "${member.user.username}"`);
            return msg.reply(
                `Deleted player ${user.tag} with ID ${deletedPlayer.userId} at <t:${msg.client.dbHelper.convertTimestamp(deletedPlayer.updatedAt)}:f>`
            );
        } catch (error) {
            msg.client.botLogger({
                embed: msg.client.errorMessage(
                    error,
                    msg.client.errorTypes.DATABASE,
                    msg.command.name
                ),
            });
        }
    }
};
