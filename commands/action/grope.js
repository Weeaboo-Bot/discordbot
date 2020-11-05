const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { disgustP, gropeP } = require('../../assets/json/actions.json');

module.exports = class GropeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'grope',
			group: 'action',
			memberName: 'grope',
			guildOnly: true,
			description: 'Gropes..? the user you mentioned...?',
			examples: ['~grope <user>'],
			throttling: {
				usages: 1,
				duration: 3,
			},
		});
	}

	run(message) {
		const recipient = message.content.split(/\s+/g).slice(1).join(' ');
		const disgust = disgustP[Math.round(Math.random() * (disgustP.length - 1))];
		const grope = gropeP[Math.round(Math.random() * (gropeP.length - 1))];

		if (!recipient) {
			var embed = new Discord.MessageEmbed()
				.setColor('#FBCFCF')
				.setImage(disgust);
			return message.channel.send(`${message.author} gropes... themselves..?`, { embed: embed });

		}
		else if (message.mentions.users.first() == message.author) {
			var embed = new Discord.MessageEmbed()
				.setColor('#FBCFCF')
				.setImage(disgust);
			return message.channel.send(`${message.author} gropes... themselves..?`, { embed: embed });

		}
		else if (message.mentions.users.first() == this.client.user) {
			const embed = new Discord.MessageEmbed()
				.setColor('#FBCFCF')
				.setImage(grope);
			return message.channel.send('E-EH?! Nya! Where...are you.. touching.. (✿\´ ꒳ ` ) I guess I\'m okay with it as long as you are... Don\'t take this the wrong way!', { embed: embed });

		}
		else {
			var embed = new Discord.MessageEmbed()
				.setColor('#FBCFCF')
				.setImage(grope);
			return message.channel.send(`${message.author} has started... groping ${recipient}?`, { embed: embed });
		}
	}
};