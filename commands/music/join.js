const { Command } = require('discord.js-commando');

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            aliases: ['addbot'],
            group: 'music',
            memberName: 'join',
            guildOnly: true,
            description: 'Music Bot will Join a voice channel'
        });
    }

    run(message){
        var voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('User must Join a channel and try again');

        return message.guild.me.voice.channel.join();
      }
    };