const Command = require('../../models/Command');
const Discord = require('discord.js');
const fs = require('fs');
const clipboard = require('clipboardy');

module.exports = class ClipboardCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clipboard',
			aliases: ['clip', 'cb'],
			group: 'utility',
			memberName: 'clipboard',
			guildOnly: true,
			description: 'Interact with your local Clipboard',
			examples: ['~clipboard <copy/paste> text'],
			args: [
				{
					key: 'action',
					type: 'string',
					prompt: 'What action would you like to take?',
					oneOf: ['copy', 'paste']
				}
			]
		});
	}
	
	async run(message, { action }) {
		
		
		const channel = message.channel;
		//	const channel = message.client.channels.cache.get(message.channel.id);
		switch(action){
		
		case 'copy': {
		
			message.reply('You will now have 15 seconds to send the message to be copied.');
			
			
			message.channel.awaitMessages(m => m.author.id === message.author.id,
					{ max: 1, time: 15000 }).then(collected => {
						if(collected.first().author.id !== message.author.id){
							message.reply('Sorry, only the orignal command issuer can use this!');
						}
						
				// only accept messages by the user who sent the command
				
				// accept only 1 message, and return the promise after 5000ms = 5sec
				
				// first (and, in this case, only) message of the collection
				clipboard.write(collected.first().cleanContent).then(res => {
				
					message.reply('Thanks, your text has been copied to your local clipboard!')
				})
				
			}).catch(() => {
				message.reply('No answer after 15 seconds, operation canceled.');
			});
			break;
		}
		case 'paste':{
			const optionList = [
					'DM',
					'Current Channel'
			]
			message.reply(`Please select where I should paste this to: ${optionList}`);
			message.channel.awaitMessages(m => optionList.includes(m),
					{max: 1, time: 15000}).then(collected => {
				// only accept messages by the user who sent the command
				// accept only 1 message, and return the promise after 30000ms = 30s
				const currMsg = collected.first().cleanContent.toLowerCase();
				// first (and, in this case, only) message of the collection
				while (optionList.includes(currMsg)) {
					if(currMsg == 'DM'){
						const id = message.author.id;
						message.client.users.fetch(id).then(user => {user.send(clipboard.readSync())});
						
					} else if(currMsg == 'Current Channel'){
						message.reply(clipboard.readSync());
					}
					
				}
			}).catch(() => {
				message.reply('No answer after 15 seconds, operation canceled.');
			});
			break;
		}
		default: {
			message.reply('An Error happened!.')
		}
		
		
		}
		
		

		


		
		
		
		
	}
};