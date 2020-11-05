const { Command } = require('discord.js-commando');


module.exports = class BanCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hackban',
			aliases: ['hb', 'banid'],
			group: 'moderation',
			memberName: 'hackban',
			guildOnly: true,
			clientPermissions: ['BAN_MEMBERS'],
			userPermissions: ['BAN_MEMBERS'],
			description: 'Bans the given user ID, even if they\'re not in the server!',
			examples: ['!softban [userID] [reason]'],
			throttling: {
				usages: 1,
				duration: 15,
			},
			args: [{
				key: 'memberName',
				prompt: 'Please provide me a user ID to hackban!',
				type: 'string',
			},
			{
				key: 'reason',
				prompt: 'Please provide me a reason to hackban this user!',
				type: 'string',
				validate: reason => {
					if (reason.length < 140) return true;
					return 'Reason must be under 140 characters!';
				},
			},
			],
		});
	}

	async run(message, { memberName, reason }) {
		const member = message.mentions.members.first();

		if (member.id === this.client.user.id) return message.channel.send('Please don\'t ban me...!');
		if (member.id === message.author.id) return message.channel.send('I wouldn\'t dare ban you...!');
		if (member.roles.highest.position > message.member.roles.highest.position - 1) return message.channel.send(`❎ | You can't ban **${member.user.username}**! Their position is higher than you!`);
		if (!member.bannable) return message.channel.send(`❎ | I can't ban **${member.user.username}**! Their role is higher than mine!`);

		this.client.users.fetch(member.id).then(async usr => {
			await message.channel.send(`Are you sure you want to ban **${usr.tag}**? \`\`(y/n)\`\``);
			const msgs = await message.channel.awaitMessages(res => res.author.id === message.author.id, {
				max: 1,
				time: 30000,
			});

			if (!msgs.size || !['y', 'yes'].includes(msgs.first().content.toLowerCase())) return message.channel.send('Cancelled command!');
			if (['n', 'no'].includes(msgs.first().content.toLowerCase())) return message.channel.send('Cancelled command!');

			await message.guild.members.ban(member, {
				reason: `${message.author.tag}: ${reason}`,
			});
			return await message.channel.send(`Successfully banned **${usr.tag}**! 👋`);
		});


	}
};