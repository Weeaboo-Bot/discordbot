const { MessageEmbed } = require('discord.js');
const moment = require('moment');

// Export guild member add events
module.exports = async (client, member) => {

	client.logger.info(
		`${member.guild.name}: ${member.user.tag} has joined the server`);

	const memberLog = client.fetchJoinLeaveChannel();
	if (
		memberLog &&
			memberLog.viewable &&
			memberLog.permissionsFor(member.guild.me)
				.has(['SEND_MESSAGES', 'EMBED_LINKS'])
	) {
		const embed = new MessageEmbed()
			.setTitle('Member Joined')
			.setAuthor(`${member.guild.name}`,
				member.guild.iconURL({ dynamic: true }))
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setDescription(`${member} (**${member.user.tag}**)`)
			.addField('Account created on',
				moment(member.user.createdAt).format('dddd, MMMM Do YYYY'))
			.setTimestamp()
			.setColor(member.guild.me.displayHexColor);
		memberLog.send(embed);
	}

};
