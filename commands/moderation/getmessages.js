const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { ERROR_LOG } = require('../../config').logs;
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');


module.exports = class GetMessages extends Command {
	constructor(client) {
		super(client, {
			name: 'getmessages',
			group: 'moderation',
			aliases: ['getmsg'],
			memberName: 'getmessages',
			description: 'Get all messages in current channel',
			examples: ['!getmessages'],
			guildOnly: true,

		});
	}

	run(message) {

		message.channel.fetchMessages().then(async messages => {
			console.log(`${messages.size} Messages.`);

			const finalArray = [];

			const putInArray = async (data) => finalArray.push(data);
			const handleTime = (timestamp) => moment(timestamp).format('DD/MM/YYYY - hh:mm:ss a').replace('pm', 'PM').reaplce('am', 'AM');

			for (const message of messages.array().reverse()) await putInArray(`${handleTime(message.timestamp)} ${msg.author.username} : ${msg.content}`);

			console.log(finalArray);
			console.log(finalArray.length);

		});
	}
};
