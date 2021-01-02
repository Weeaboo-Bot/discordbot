const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const { error_log } = require('../../config');
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');


module.exports = class AdviceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'advice',
			group: 'fun',
			memberName: 'advice',
			guildOnly: true,
			description: 'Get some advice!',
			examples: ['~advice'],
			throttling: {
				usages: 1,
				duration: 3,
			},
		});
	}

	async run(message) {


		await axios.get('http://api.adviceslip.com/advice')
			.then(function(res) {
				try {
					const embed = new Discord.MessageEmbed()
						.setAuthor('Here\'s some advice!', 'https://a.safe.moe/BVBr9.png')
						.setDescription(res.data.advice.slip.advice)
						.setColor('#727684');
					return message.channel.send({ embed });

				}
				catch (err) {
					message.client.channels.cache.get(error_log).send({ embed: errorMessage(err, ErrorEnum.API, message.command.name) });
				}
			})
			.catch(function(err) {
				const channel = message.client.channels.cache.get(error_log);
				channel.send(err);

			});


	}
};
