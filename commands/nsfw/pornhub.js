const Command = require('../../structures/Command');
const Discord = require('discord.js');
const PH = require('pornhub');
const { ERROR_LOG } = require('../../config').logs;
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');
const errors = require('../../assets/json/errors');


module.exports = class PornHubCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pornhub',
			group: 'nsfw',
			memberName: 'pornhub',
			guildOnly: true,
			description: 'Searches for videos on Pornhub!',
			details: 'This command can only be used in NSFW channels!',
			examples: ['~pornhub [search]'],
			throttling: {
				usages: 1,
				duration: 3,
			},
			args: [
				{
					key: 'search',
					type: 'string',
					prompt: 'Please enter something to search for!',
				},
			],
		});
	}

	async run(message, { search }) {
		const errMessage = errors[Math.round(Math.random() * (errors.length - 1))];
		if (!message.channel.nsfw) {
			message.react('💢');
			return message.channel.send(errMessage);
		}

		try {
			await PH.search({
				search: search,
				thumbsize: 'medium',


			}).then(function(res) {
				console.log(res);
				// res.data.slice(0,4).forEach(item => {
				//     const viewKey = item.url.slice(47);
				//    return message.channel.send({embed : new Discord.MessageEmbed()
				//            .setTitle(item.title)
				//            .setImage(item.preview)
				//            .addField('HD: ',item.hd)
				//            .addField('Video Length',item.duration)
				//            .addField('Video URL',` **${search}** (https://www.pornhub.com/view_video.php?viewkey=${viewKey})`)
				//            .setURL(item.url)})
				//
				// })
			})
				.catch(function(error) {
					message.client.channels.cache.get(ERROR_LOG).send({ embed: errorMessage(error, ErrorEnum.API, message.command.name) });
				});

			return null;

		}
		catch (err) {
			return message.channel.send(`No results found for **${search}**`);
		}
	}
};
