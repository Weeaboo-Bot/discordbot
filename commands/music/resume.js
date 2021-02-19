const Command = require('../../structures/Command');

module.exports = class ResumeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'resume',
            aliases: ['resume-song', 'continue'],
            memberName: 'resume',
            group: 'music',
            description: 'Resume the current paused song',
            guildOnly: true,
        });
    }

    run(message) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('Join a channel and try again');

        if (
            typeof message.guild.musicData.songDispatcher == 'undefined' ||
            message.guild.musicData.songDispatcher === null
        ) {
            return message.reply('There is no song playing right now!');
        }

        message.say('Song resumed :play_pause:');

        message.guild.musicData.songDispatcher.resume();
    }
};
