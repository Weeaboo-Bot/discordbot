const { MessageEmbed } = require('discord.js');
const { formatNumber } = require('../util/Util');
module.exports = async (client, guild) => {
	const joinLeaveChannel = await client.fetchJoinLeaveChannel();
	if (joinLeaveChannel) {
		const embed = new MessageEmbed()
			.setColor(0xFF0000)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setTitle(`Left ${guild.name}...`)
			.setFooter(`ID: ${guild.id}`)
			.setTimestamp()
			.addField('❯ Members', formatNumber(guild.memberCount));
		await joinLeaveChannel.send({ embed });
	}
};
