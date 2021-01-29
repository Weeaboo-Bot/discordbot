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
		let result = null;
		try {
			alpha.data.intraday(stock).then((data) => {
				if (data != null) {
					result = alpha.util.polish(data);
					const embed = new Discord.MessageEmbed()
							.setTitle('Current Stock Price:')
							.setColor('#FBCFCF')
							.addField('Stock Symbol: ', result.meta.symbol.toUpperCase())
							.addField('Stock Price: ', result.data.open);
					message.delete();
					return message.channel.send({ embed: embed });
				}
				else {
					
					return message.channel.send('Sorry, could not process request.');
				}
				
			});
		} catch (error) {
			
			message.client.channels.cache.get(message.client.errorLog)
					.send({
						embed: errorMessage(error, ErrorEnum.API, message.command.name),
					});
		}
		
		
	}
};
