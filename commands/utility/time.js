const { Command } = require('discord.js-commando');
const axios = require('axios');
const { error_log } = require('../../config');
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes');
const moment = require('moment');
const clocks = [
	'🕛',
	'🕐',
	'🕑',
	'🕒',
	'🕓',
	'🕔',
	'🕕',
	'🕖',
	'🕗',
	'🕘',
	'🕙',
	'🕚'];

module.exports = class TimeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'time',
			aliases: ['clock'],
			group: 'utility',
			memberName: 'time',
			guildOnly: true,
			description: 'Shows the time for the given location!',
			examples: ['!time [city/country]'],
			throttling: {
				usages: 1,
				duration: 5,
			},
			args: [
				{
					key: 'location',
					type: 'string',
					prompt: 'Please Enter a Location',
				},
			],
		});
	}

	async run(message, { location }) {

		if (!location) return message.channel.send('Please specify a location for me to gather information from!');


		await axios.get(`https://time.is/${location}`)
			.then(function(res) {
				if (res.status !== 200) {
					return message.channel.send('❎ | Could not connect to the server!');
				}

				const text = res.data;

				const date = text.match(new RegExp('<div id="dd" class="w90 tr" onclick="location=\'/calendar\'" ' + 'title="Click for calendar">([^]+?)</div>'))[1];
				const time = text.match(/<div id="twd">([^]+?)<\/div>/)[1].replace(/<span id="ampm" style="font-size:21px;line-height:21px">(AM|PM)<\/span>/, ' $1');
				const place = text.match(/<div id="msgdiv"><h1>Time in ([^]+?) now<\/h1>/)[1];
				const clock = clocks[parseInt(time.split(':')[0], 10) % 12];

				const parsedTime = moment(`${date} ${time}`, 'dddd, MMMM D, YYYY HH:mm:ss A');
				return message.channel.send(`${clock} | The time in **${place}** is \`${parsedTime.format('dddd, MMMM Do YYYY @ h:mm:ss a')}\`!`);

			})
			.catch(function(err) {
				message.channel.send(`❎ | Location **${location}** was not found!`);
				return message.client.channels.cache.get(error_log).send({ embed: errorMessage(err, ErrorEnum.API, message.command.name) });
			});


	}
};