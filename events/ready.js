const Database = require('../util/db');
const db = new Database();
const { MessageEmbed } = require('discord.js');
const { version } = require('../package.json');
const { formatNumber } = require('../util/Util');
module.exports = async (client) => {


	// Push client-related activities
	client.activities.push(
		{ text: () => `${formatNumber(client.guilds.cache.size)} servers`, type: 'WATCHING' },
		{ text: () => `with ${formatNumber(client.registry.commands.size)} commands`, type: 'PLAYING' },
		{ text: () => `${formatNumber(client.channels.cache.size)} channels`, type: 'WATCHING' },
	);

	// Interval to change activity every minute
	client.setInterval(() => {
		const activity = client.activities[Math.floor(Math.random() * client.activities.length)];
		const text = typeof activity.text === 'function' ? activity.text() : activity.text;
		client.user.setActivity(text, { type: activity.type });
	}, 60000);


	client.logger.info('Updating database and scheduling jobs...');
	for (const guild of client.guilds.cache.values()) {


		// Update users table
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
				}, false);

		});

		// Update channels table
		guild.channels.cache.forEach(channel => {
			db.createDocument('channels', {
				id: channel.id,
				group: channel.parent ? channel.parent.name : 'N/A',
				type: channel.type,
				members: channel.members ? channel.members.toJSON() : 'N/A',
				created: channel.createdAt,
				position: channel.position,
				guild: channel.guild ? channel.guild.name : 'N/A',
			}, false);
		});

		// Update commands table
		client.registry.commands.forEach(command => {
			db.createDocument('commands', {
				name: command.name,
				aliases: command.aliases,
				examples: command.examples,
				group: command.group.name,
				desc: command.description,
				client_permissions: command.clientPermissions,
				user_permissions: command.userPermissions,
				nsfw: command.nsfw,
				guild_only: command.guildOnly,
			}, true);
		});


		// Update roles table
		guild.roles.cache.forEach(role => {
			db.createDocument('roles', {
				id: role.id,
				name: role.name,
				color: role.hexColor,
				members: role.members.toJSON(),
				perms: role.permissions.toJSON(),
				created: role.createdAt,
			}, false);
		});
	}

	client.logger.info(`[READY] Logged in as ${client.user.tag}! ID: ${client.user.id}`);
	client.logger.info(`Weaboo is running on ${client.guilds.cache.size} server(s)`);

	const channel = client.channels.cache.get(client.statusLog);
	const embed = new MessageEmbed()
		.setAuthor('Weaboo has (re)started!', client.user.displayAvatarURL({ format: 'png' }))
		.setColor('#727293')
		.setDescription(`•\u2000\Serving ${client.users.cache.size} users in ${client.guilds.cache.size} servers and ${client.channels.cache.size} channels!\n\u2000**Commands:** ${client.registry.commands.size}`)
		.setFooter(`v${version}`)
		.setTimestamp();
	channel.send({ embed });


};
