const { MessageEmbed } = require('discord.js');

module.exports = (client, oldMessage, newMessage) => {
	
	if (newMessage.webhookID) return; // Check for webhook
	
	// Detect edited commands
	if (
			newMessage.member &&
			newMessage.id === newMessage.member.lastMessageID &&
			!oldMessage.command
	) {
		client.emit('message', newMessage);
	}
	
	const embed = new MessageEmbed()
			.setAuthor(`${newMessage.author.tag}`,
					newMessage.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor(newMessage.guild.me.displayHexColor);
	
	// Content change
	if (oldMessage.content != newMessage.content) {
		
		
		const messageEditLog = client.fetchAuditChannel();
		if (
				messageEditLog &&
				messageEditLog.viewable &&
				messageEditLog.permissionsFor(newMessage.guild.me)
						.has(['SEND_MESSAGES', 'EMBED_LINKS'])
		) {
			
			if (newMessage.content.length >
					1024) {
				newMessage.content = newMessage.content.slice(0, 1021) + '...';
			}
			if (oldMessage.content.length >
					1024) {
				oldMessage.content = oldMessage.content.slice(0, 1021) + '...';
			}
			
			embed
					.setTitle('Message Update: `Edit`')
					.setDescription(`
          ${newMessage.member}'s **message** in ${newMessage.channel} was edited. [Jump to message!](${newMessage.url})
        `)
					.addField('Before', oldMessage.content)
					.addField('After', newMessage.content);
			messageEditLog.send(embed);
		}
	}
	
	// Embed delete
	if (oldMessage.embeds.length > newMessage.embeds.length) {
		const messageDeleteLog = client.fetchAuditChannel();
		if (
				messageDeleteLog &&
				messageDeleteLog.viewable &&
				messageDeleteLog.permissionsFor(newMessage.guild.me)
						.has(['SEND_MESSAGES', 'EMBED_LINKS'])
		) {
			
			embed.setTitle('Message Update: `Delete`');
			if (oldMessage.embeds.length > 1) {
				embed.setDescription(
						`${newMessage.member}'s **message embeds** in ${newMessage.channel} were deleted.`);
			}
			else {
				embed.setDescription(
						`${newMessage.member}'s **message embed** in ${newMessage.channel} was deleted.`);
			}
			messageDeleteLog.send(embed);
		}
	}
};
