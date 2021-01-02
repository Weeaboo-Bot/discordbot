const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { GiphyFetch } = require('@giphy/js-fetch-api');
const { ERROR_LOG, GIPHY_KEY } = require('../../config');
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');
const gf = new GiphyFetch(GIPHY_KEY);

module.exports = class GiphyCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'giphy',
			group: 'fun',
			aliases: ['gif'],
			memberName: 'giphy',
			description: 'Searches Giphy for gifs!',
			examples: ['~giphy [tags]'],
			args: [{
				key: 'query',
				prompt: 'Please provide me a term to search for!',
				type: 'string',
				default: 'wtf',
			}],
		});
	}

	async run(message, { query }) {

		await gf.search(query,
			{
				sort: 'relevant',
				lang: 'en',
				limit: 10,
				type: 'gifs',
			})
			.then(function(res) {
				if (!res.data.length) return message.channel.send(`No results found for **${query}**!`);
				const random = Math.floor(Math.random() * res.data.length);

				return message.channel.send({ embed: new Discord.MessageEmbed().setImage(res.data[random].images.original.url)
					.setColor('#ADC4CC') });

			})
			.catch(function(err) {
				message.client.channels.cache.get(ERROR_LOG).send({ embed: errorMessage(err, ErrorEnum.API, message.command.name) });
			});


	}
};
