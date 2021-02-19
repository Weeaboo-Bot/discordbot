const Command = require('../../structures/Command');

module.exports = class LeaveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            aliases: ['end'],
            group: 'music',
            memberName: 'leave',
            guildOnly: true,
            description: 'Music Bot will leave a voice channel if in one.',
        });
    }

    async run(message) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('User must Join a channel and try again');
        }

        if (message.member.voice.channel) {
            await message.member.voice.channel.leave();
        }
    }
};
