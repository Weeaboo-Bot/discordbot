module.exports = {
	name: 'server-info',
	description: 'Output Some Server Info',
	execute(message, args) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`)
	},
};