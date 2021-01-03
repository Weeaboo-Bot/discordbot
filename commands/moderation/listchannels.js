const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { ERROR_LOG } = require('../../config').logs;
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');

module.exports = class ListChannelsCommand extends Command {

	constructor(client) {
		super(client, {
			name: 'listchannels',
			group: 'moderation',
			memberName: 'listchannels',
			aliases: ['channelslist'],
			description: 'List all the channels in this server.',
			guildOnly: true,
		});
	}
	run(message) {
		const channelList = message.guild.channels.cache;


		channelList.forEach(channel => {
			let index = 0;
			const memberList = [];

			if(channel.members.size > 0) {
				while (index < channel.members.size) {
					memberList.push(channel.members.toJSON()[index].displayName);
					index++;
				}
			}
			else {
				memberList.push('No Members');
			}
			return message.channel.send({ embed: new Discord.MessageEmbed()
				.setTitle(channel.name)
				.addField('Channel ID', channel.id)
				.addField('Channel Type', channel.type)
				.addField('Channel Members', memberList)
				.addField('Channel Category', channel.parent),


			});
		});
	}
};
