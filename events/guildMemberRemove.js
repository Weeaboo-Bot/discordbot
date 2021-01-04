const Database = require('../util/db');
module.exports = async (client, guild, member) => {
	if (member.id === client.user.id) return null;
	if (member.partial) await member.fetch();
	const channel = member.guild.systemChannel;
	if (!channel || !channel.permissionsFor(client.user).has('SEND_MESSAGES')) return null;
	if (channel.topic && channel.topic.includes('<weaboo:disable-leave>')) return null;
	try {
		const leaveMessage = client.leaveMessages[Math.floor(Math.random() * client.leaveMessages.length)];
		await channel.send(leaveMessage.replaceAll('{{user}}', `**${member.user.tag}**`));
		return null;
	}
	catch {
		return null;
	}
};
