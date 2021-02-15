const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { kissP } = require('../../assets/json/actions.json');

module.exports = class KissCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'kiss',
			aliases: ['smooch'],
			group: 'action',
			memberName: 'kiss',
			guildOnly: true,
			description: 'Kisses the user you mentioned!',
			examples: ['~kiss <user>'],
			throttling: {
				usages: 1,
				duration: 3,
			},
		});
	}

	run(message) {
		const recipient = message.content.split(/\s+/g).slice(1).join(' ');
		const kiss = kissP[Math.round(Math.random() * (kissP.length - 1))];
		const chan = client.channels.cache.get(client.auditLog);

		if (!recipient) {
			const embed = new Discord.MessageEmbed()
				.setColor('#FBCFCF')
				.setImage(kiss);
			const embed_2 = new MessageEmbed()
				.setTitle('Debug Event')
				.setColor('#727293')
				.addField('the link sent was ' + kiss)
				.setTimestamp();
			chan.send({ embed_2 });
			return message.channel.send(`You can't kiss yourself, but I'll kiss you, ${message.author}!`, { embed: embed });
		}
		else if (message.mentions.users.first() == message.author) {
			const embed = new Discord.MessageEmbed()
				.setColor('#FBCFCF')
				.setImage(kiss);
			const embed_2 = new MessageEmbed()
				.setTitle('Debug Event')
				.setColor('#727293')
				.addField('the link sent was ' + kiss)
				.setTimestamp();
			chan.send({ embed_2 });
			return message.channel.send(`You can't kiss yourself, but I'll kiss you, ${message.author}!`, { embed: embed });

		}
		else if (message.mentions.users.first() == this.client.user) {
			const embed = new Discord.MessageEmbed()
				.setColor('#FBCFCF')
				.setImage(kiss);
			const embed_2 = new MessageEmbed()
				.setTitle('Debug Event')
				.setColor('#727293')
				.addField('the link sent was ' + kiss)
				.setTimestamp();
			chan.send({ embed_2 });
			return message.channel.send('I-It\'s not like I wanted you to kiss me or anything...・:*(〃・ｪ・〃人)*:・', { embed: embed });

		}
		else {
			const embed = new Discord.MessageEmbed()
				.setColor('#FBCFCF')
				.setImage(kiss);
			const embed_2 = new MessageEmbed()
				.setTitle('Debug Event')
				.setColor('#727293')
				.addField('the link sent was ' + kiss)
				.setTimestamp();
			chan.send({ embed_2 });
			return message.channel.send(`${message.author} kisses ${recipient}!`, { embed: embed });
		}
	}
};
