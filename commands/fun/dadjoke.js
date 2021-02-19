const Command = require('../../structures/Command');
const Discord = require('discord.js');
const axios = require('axios');
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');


module.exports = class DadJokeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dadjoke',
			aliases: ['dadpun', 'joke', 'pun'],
			group: 'fun',
			memberName: 'dadjoke',
			guildOnly: true,
			description: 'Get a random dad joke!',
			examples: ['~dadjoke'],
			throttling: {
				usages: 1,
				duration: 3,
			},
		});
	}

	async run(message) {

		await axios.get('https://icanhazdadjoke.com/', {
			headers: { 'Accept': 'application/json' },
		})
			.then(function(res) {
				const msg = new Discord.MessageEmbed()
					.setAuthor('Here\'s a joke!', 'https://files.catbox.moe/3cvymb.gif')
					.setDescription(res.data.joke)
					.setColor('#727684');

				return message.channel.send({ embed: msg });
			})
			.catch(function(err) {
				message.client.channel.cache.get(message.client.errorLog).send({ embed: errorMessage(err, ErrorEnum.API, message.command.name) });
			});


	}
};
