const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { error_log } = require('../../config');
const { errorMessage } = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');


module.exports = class ListRolesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'listroles',
			guildOnly: true,
			memberName: 'listroles',
			aliases: ['roleslist'],
			group: 'moderation',
			description: 'List all Roles in this Server',
		});

	}
	run(message) {

		const rolesList = message.guild.roles.cache;


		rolesList.forEach(role => {
			let index = 0;
			const memberList = [];
			while(index < role.members.size) {
				memberList.push(role.members.toJSON()[index].displayName);
				index++;
			}

			return message.channel.send({
				embed: new Discord.MessageEmbed()
					.setTitle(role.name)
					.addField('Role ID', role.id)
					.addField('Role Color', role.color)
					.setColor(role.color)
					.addField('Role Members', memberList),
			});


		});


	}


};