const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { error_log } = require('../../config');
const { errorMessage } = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');


module.exports = class ImposterCommand extends Command {
	constructor(client) {
		super(client, {
			name:'imposter',
			memberName:'imposter',
			aliases: ['otherusermsg'],
			group:'fun',
			guildOnly: true,
			description: 'Send a message as a different user',
			args: [
				{
					key: 'user',
					type: 'string',
					prompt: 'Please enter a user to send as',

				},
				{
					key: 'msg',
					type: 'string',
					prompt: 'please enter msg to send',
				},
			],
		});

	}

	run(message, { user, msg }) {
		const member = message.mentions.members.first();


	}

};