const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { error_log } = require('../../config');
const { errorMessage } = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');
const log = require('../../functions/consoleLogging');
const lodash = require('lodash');
const { firebase } = require('../../index');



module.exports = class GetMemberPointsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'getmemberpoints',
			group: 'loyal',
			memberName: 'getmemberpoints',
			description: 'Get the current Points Status of this Member',
			args: [
				{
					key: 'memberName',
					type: 'string',
					prompt: 'Please enter a member to search for.',
				},
			],
		});
	}
	run(message, { memberName }) {
 
		const db = firebase.firestore();
		
		
		
	

	}
};