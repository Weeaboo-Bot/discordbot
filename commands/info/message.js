const Command = require('../../models/Command');
const { MessageEmbed } = require('discord.js');

module.exports = class MessageCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'message',
			aliases: ['message-info', 'msg', 'msg-info', 'reply'],
			group: 'info',
			memberName: 'message',
			description: 'Responds with detailed information on a message.',
			clientPermissions: ['EMBED_LINKS'],
			args: [
				{
					key: 'message',
					prompt: 'Which message would you like to get information on?',
					type: 'message',
				},
			],
		});
	}

	run(msg, { message }) {
		const embed = new MessageEmbed()
			.setColor(message.member ? message.member.displayHexColor : 0x00AE86)
			.setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
			.setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
			.setDescription(message.content)
			.setTimestamp(message.createdAt)
			.setFooter(`ID: ${message.id}`)
			.addField('❯ Jump', message.url);
		return msg.embed(embed);
	}
};