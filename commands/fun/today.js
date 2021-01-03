const Command = require('../../structures/Command');
const Discord = require('discord.js');
const axios = require('axios');
const { ERROR_LOG } = require('../../config').logs;
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');

module.exports = class TodayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'today',
			guildOnly: true,
			aliases: ['date', 'history'],
			group: 'fun',
			memberName: 'today',
			description: 'Finds a historical event from today!',
			examples: ['~today'],
			throttling: {
				usages: 1,
				duration: 5,
			},
		});
	}

	async run(message) {

		await axios.get('http://history.muffinlabs.com/date')
			.then(function(res) {
				const source = res.data.data['Events'];
				const event = source[Math.round(Math.random() * (source.length - 1))];
				return message.channel.send({ embed: new Discord.MessageEmbed()
					.setAuthor(`Historical Event from ${res.data.date}, ${event.year}`)
					.setColor('#B1AFFC')
					.setDescription(event.text)
					.addField('❯\u2000\Information', `•\u2000\**Year:** ${event.year}\n\•\u2000\**External Link${event.links.length !== 1 ? 's' : ''}:** ${event.links.map(l => `[${l.title}](${l.link})`).join(', ')}`) });
			})
			.catch(function(err) {
				message.client.channels.cache.get(ERROR_LOG).send({ embed: errorMessage(err, ErrorEnum.API, message.command.name) });
			});


	}
};
