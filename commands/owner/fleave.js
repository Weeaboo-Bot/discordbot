const Command = require('../../structures/Command');

module.exports = class FLeaveCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'fleave',
            aliases: ['forceleave', 'leaveguild', 'removeguild'],
            group: 'owner',
            memberName: 'fleave',
            description: 'Leaves a guild!',
            details: 'Only the bot owner can use this command!',
            examples: ['~fleave 1234567890'],

            args: [
                {
                    key: 'toLeave',
                    label: 'toLeave',
                    prompt: 'Please specify a guild to leave!',
                    type: 'string',
                },
                {
                    key: 'reason',
                    label: 'reason',
                    prompt: 'For what reason am I leaving the server?',
                    type: 'string',
                },
            ],
        });
    }

    hasPermission(message) {
        return this.client.isOwner(message.author);
    }

    async run(message, { toLeave, reason }) {
        const guild = this.client.guilds.cache.get(toLeave) || 'woopsies';
        if (guild == 'woopsies')
            return message.channel.send(
                'That guild was not found! Please try again!'
            );

        const defaultChannel = guild.channels.cache.find((c) =>
            c.permissionsFor(guild.me).has('SEND_MESSAGES')
        );

        try {
            try {
                defaultChannel.send(
                    `👋 My developer has requested that I leave this server!\n\**Reason:** ${args.reason}`
                );
            } catch (err) {}
            guild.leave();
            return message.channel.send(
                `Successfully left the guild **${guild.name}**!`
            );
        } catch (err) {
            return message.channel.send(
                `There was an error leaving the specified guild! \`${err}\``
            );
        }
    }
};
