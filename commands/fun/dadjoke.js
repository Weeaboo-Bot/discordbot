const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const { error_log } = require('../../config');
const { errorMessage } = require('../../discord_functions/logHandler');
const ErrorEnum = require('../../discord_functions/errorTypes');


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
					.setAuthor('Here\'s a joke!', 'https://a.safe.moe/X1gKJ.png')
					.setDescription(res.data.joke)
					.setColor('#727684');

				return message.channel.send({ embed: msg });
			})
			.catch(function(err) {
				message.client.channels.cache.get(error_log).send({ embed: errorMessage(err, ErrorEnum.API, message.command.name) });
			});


	}
};