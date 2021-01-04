const Database = require('../util/db');
const { MessageEmbed } = require('discord.js');
const db = new Database();
module.exports = async (client, guild) => {
	if (guild.systemChannel && guild.systemChannel.permissionsFor(client.user).has('SEND_MESSAGES')) {
		try {
			const usage = client.registry.commands.get('help').usage();
			await guild.systemChannel.send(`Hi! I'm Weaboo, use ${usage} to see my commands, yes?`);

			// Add users table
			guild.members.cache.forEach(member => {

				db.createDocument('users',
					{
						id: member.id,
						username: member.user.username,
						disc: member.user.discriminator,
						guild: guild.id,
						guild_name: guild.name,
						joined: member.joinedAt,
						isBot: member.bot ? 1 : 0,
					},
				);

			});
		}
		catch {
			// Nothing!
		}
	}
	const joinLeaveChannel = await client.fetchJoinLeaveChannel();
	if (joinLeaveChannel) {
		if (!guild.members.cache.has(guild.ownerID)) await guild.members.fetch(guild.ownerID);
		const embed = new MessageEmbed()
			.setColor(0x7CFC00)
			.setThumbnail(guild.iconURL({ format: 'png' }))
			.setTitle(`Joined ${guild.name}!`)
			.setFooter(`ID: ${guild.id}`)
			.setTimestamp()
			.addField('❯ Members', formatNumber(guild.memberCount))
			.addField('❯ Owner', guild.owner.user.tag);
		await joinLeaveChannel.send({ embed });
	}
};
