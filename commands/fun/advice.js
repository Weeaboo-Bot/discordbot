const Command = require('../../structures/Command');
const Discord = require('discord.js');
const axios = require('axios');
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
						.setAuthor('Here\'s some advice!', 'https://files.catbox.moe/3cvymb.gif')
						.setDescription(res.data.slip.advice)
						.setColor('#727684');
					return message.channel.send({ embed });

				}
				catch (err) {
					message.client.channels.cache.get(message.client.errorLog)
							.send({
								embed: errorMessage(err, ErrorEnum.JS, message.command.name),
							});
				}
			})
			.catch(function(err) {
				message.client.channels.cache.get(message.client.errorLog)
						.send({
							embed: errorMessage(err, ErrorEnum.API, message.command.name),
						});
			});


	}
};
