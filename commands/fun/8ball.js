const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { yesQuotes, laterQuotes, noQuotes, yesP, noP } = require('../../assets/json/8-ball.json');


module.exports = class EightBallCommand extends Command {
	constructor(client) {
		super(client, {
			name: '8ball',
			aliases: ['8b', 'ball'],
			group: 'fun',
			memberName: '8ball',
			guildOnly: true,
			description: 'Ask the magic 8ball a question!',
			examples: ['~8ball [question]'],
			throttling: {
				usages: 1,
				duration: 3,
			},
		});
	}

	run(message) {
		const question = message.content.split(/\s+/g).slice(1).join(' ');
		const yes = yesQuotes[Math.round(Math.random() * (yesQuotes.length - 1))] + '.';
		const later = laterQuotes[Math.round(Math.random() * (laterQuotes.length - 1))] + '.';
		const no = noQuotes[Math.round(Math.random() * (noQuotes.length - 1))] + '.';
		const yesgif = yesP[Math.round(Math.random() * (yesP.length - 1))];
		const nogif = noP[Math.round(Math.random() * (noP.length - 1))];


		if (!question) {
			return message.channel.send('You must provide a question!');
		}

		function randomNumber(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		//chooses a random number to determine which type of message + corresponding gif will be sent
		var choice = randomNumber(1, 3);

		//yes messsages and gifs
		if (choice == 1) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(question)
				.setDesciption(yes)
				.setImage(yesgif)
				.setColor('#646770')
		}
		//no messages and gifs
		else if (choice == 2) {
			const embed = new Discord.MessageEmbed()
				.setAuthor(question)
				.setDesciption(no)
				.setImage(nogif)
				.setColor('#646770')
		}
		//later messages
		else {
			const embed = new Discord.MessageEmbed()
				.setAuthor(question)
				.setDesciption(later)
				.setColor('#646770')
		}

		//const embed = new Discord.MessageEmbed()
		//	.setAuthor(question, 'https://a.safe.moe/aKDHV.png')
		//	.setDescription(answer[Math.round(Math.random() * (answer.length - 1))] + '.')
		//	.setColor('#646770');
		return message.channel.send({ embed });

	}
};
