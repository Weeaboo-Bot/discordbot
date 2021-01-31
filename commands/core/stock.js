const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');
const alphakey = require('../../config').api.ALPHA_KEY;
const alpha = require('alphavantage')({ key: alphakey });

module.exports = class StockCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stock',
			aliases: ['stonk'],
			group: 'core',
			memberName: 'stock',
			guildOnly: true,
			description: 'stock prices!',
			examples: ['!stock <symbol>'],
			throttling: {
				usages: 1,
				duration: 3,
			},
			args: [
				{
					key: 'stock',
					label: 'which stock to lookup',
					prompt: 'Please provide me a stock to lookup!',
					type: 'string',
				},
			],
		});
	}

	run(message, { stock }) {
		const theDate = new Date();
		const currDate = theDate.toISOString().split('T')[0];
		try {
			alpha.data.daily(stock).then((data) => {
				if (data != null) {
					const embed = new Discord.MessageEmbed()
						.setTitle(data['Meta Data']['1. Information'])
						.setColor('#FBCFCF')
						.addField('Stock Symbol: ', data['Meta Data']['2. Symbol'])
						.addField('Last Updated: ', data['Meta Data']['3. Last Refreshed'])
						.addField('Stock Open: ', data['Time Series (Daily)'][currDate]['1. open'])
						.addField('Stock High: ', data['Time Series (Daily)'][currDate]['2. high'])
						.addField('Stock Low: ', data['Time Series (Daily)'][currDate]['3. low'])
						.addField('Stock Close: ', data['Time Series (Daily)'][currDate]['4. close'])
						.addField('Stock Volume: ', data['Time Series (Daily)'][currDate]['5. volume']);

					message.delete();
					return message.channel.send({ embed: embed });
				}
				else {

					return message.channel.send('Sorry, could not process request.');
				}

			});
		}
		catch (error) {

			message.client.channels.cache.get(message.client.errorLog)
				.send({
					embed: errorMessage(error, ErrorEnum.API, message.command.name),
				});
		}


	}
};
