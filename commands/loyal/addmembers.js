const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { error_log } = require('../../config');
const { errorMessage } = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');
const log = require('../../functions/consoleLogging');
const lodash = require('lodash');
const { firebase } = require('../../index');


module.exports = class AddMembersCommand extends Command{
	constructor(client) {
		super(client, {
			name:'updatedb',
			memberName: 'updatedb',
			group: 'loyal',
			description: 'Update the Firestore DB',
			
		});
	}
	run(message){
		
		const db = firebase.firestore();
		
		message.guild.members.cache.each(member => {
			let memberRef = db.collection('members').doc(member.user.username);
			let getDoc = memberRef.get()
					.then(doc => {
						if (!doc.exists) {
							
							let memberData = {
								name: member.user.username,
								discriminator: member.user.discriminator,
								tag: member.user.tag,
								id: member.user.id
							};
							db.collection('members').doc(memberData.id).set(memberData);
							let pointsData = {
								discriminator:member.user.discriminator,
								points: 0,
								member: db.doc('members/' + member.user.id)
							};
							db.collection('points').doc().set(pointsData);
							console.log(`Added ${member.user.username} to DB`)
						} else {
							console.log('Member already exists in DB');
							
							
						}
					})
					.catch(err => {
						console.log('Error getting document', err);
					});
		})
	}
	
};