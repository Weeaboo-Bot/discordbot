const Command = require('../../structures/Command');
const { server_id } = require('../../config');

module.exports = class SayChannelCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'saychannel',
            aliases: ['sc', 'send', 'portal', 'announce'],
            group: 'owner',
            memberName: 'saychannel',
            description: 'This is an admin-only command',
            examples: ['none'],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 10,
            },
            args: [
                {
                    key: 'id',
                    type: 'string',
                    prompt: 'please enter id',
                },
                {
                    key: 'msg',
                    type: 'string',
                    prompt: 'Please enter text',
                },
            ],
        });
    }

    async run(message, { id, msg }) {
        if (message.guild.id !== server_id)
            return message.channel.send(
                "This command can only be used in the owner's server."
            );
        if (!message.member.hasPermission('MANAGE_GUILD'))
            return message.channel.send('You cannot use this command!');

        try {
            const channelMessage = msg;
            if (!msg)
                return message.channel.send(
                    'Provide something for me to send.'
                );

            const channel = this.client.channels.cache.get(id);
            message.channel.send(msg);

            await message.react('🇸').catch(console.error);
            await message.react('🇪').catch(console.error);
            await message.react('🇳').catch(console.error);
            await message.react('🇹').catch(console.error);

            return null;
        } catch (err) {
            return message.channel.send(
                `❎ | **An error occurred while running this command!** \`${err}\``
            );
        }
    }
};
