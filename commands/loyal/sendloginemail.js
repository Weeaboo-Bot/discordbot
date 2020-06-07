const { Command } = require('discord.js-commando');
const { firebase } = require('../../index');

module.exports = class SendLoginEmailCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'sendloginemail',
			memberName: 'sendloginemail',
			group: 'loyal',
			description: 'Send a Firebase Login Email',
			args: [
				{
					key: 'email',
					type: 'string',
					prompt: 'Please enter a User Email',
				},
			],
		});

	}
	run(message, { email }) {


		const actionCodeSettings = {
			// URL you want to redirect back to. The domain (www.example.com) for this
			// URL must be whitelisted in the Firebase Console.
			url: 'https://weaboo-bot-b5f7a.web.app/registerSuccess.html',
			// This must be true.
			handleCodeInApp: true,
			iOS: {
				bundleId: 'com.example.ios',
			},
			android: {
				packageName: 'com.example.android',
				installApp: true,
				minimumVersion: '12',
			},
			dynamicLinkDomain: 'weaboo.page.link',
		};

		firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
			.then(function(res) {
				console.log(res.user.email);
			})
			.catch(function(err) {
				console.log(err);
			});
		
		message.channel.send(`Sent a Firebase Email Link to ${message.mentions.members.first()}`);

	}


};