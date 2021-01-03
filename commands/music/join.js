const Command = require('../../structures/Command');

module.exports = class JoinCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'join',
			aliases: ['addbot'],
			group: 'music',
			memberName: 'join',
			guildOnly: true,
			description: 'Music Bot will Join a voice channel',
		});
	}

	async run(message) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) return message.reply('User must Join a channel and try again');


		if (message.member.voice.channel) {
			await message.member.voice.channel.join();
		}
	}
};
