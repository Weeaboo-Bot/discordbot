const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const axios = require('axios');
const { error_log } = require('../../config');
const { errorMessage } = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');

module.exports = class DogCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'dog',
			aliases: ['puppy', 'doggo', 'pupper'],
			group: 'fun',
			memberName: 'dog',
			guildOnly: true,
			description: 'Sends a random picture of a dog!',
			examples: ['~dog'],
			throttling: {
				usages: 1,
				duration: 5,
			},
		});
	}

	async run(message) {

		await axios.get('https://random.dog/woof.json')
			.then(function(res) {
				return message.channel.send({ embed: new Discord.MessageEmbed().setImage(res.data.url)
					.setDescription(`[Image URL](${res.data.url})`)
					.setFooter('http://www.random.dog ©', 'https://random.dog/3f62f2c1-e0cb-4077-8cd9-1ca76bfe98d5.jpg')
					.setColor('#71A3BE') });
			})
			.catch(function(err) {
				message.client.channels.cache.get(error_log).send({ embed: errorMessage(err, ErrorEnum.API, message.command.name) });
			});
	}
};