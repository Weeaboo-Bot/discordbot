const Command = require('../../structures/Command');
const Discord = require('discord.js');
const {
    yesQuotes,
    laterQuotes,
    noQuotes,
    yesP,
    noP,
} = require('../../assets/json/8-ball.json');

module.exports = class EightBallCommand extends Command {
    constructor(client) {
        super(client, {
            name: '8ball',
            aliases: ['8b', 'ball'],
            group: 'fun',
            memberName: '8ball',
            guildOnly: true,
            description: 'Ask the magic 8ball a question!',
            examples: ['!8ball [question]'],
            throttling: {
                usages: 1,
                duration: 3,
            },
        });
    }

    run(message) {
        const question = message.content.split(/\s+/g).slice(1).join(' ');
        const yes =
            yesQuotes[Math.round(Math.random() * (yesQuotes.length - 1))] + '.';
        const later =
            laterQuotes[Math.round(Math.random() * (laterQuotes.length - 1))] +
            '.';
        const no =
            noQuotes[Math.round(Math.random() * (noQuotes.length - 1))] + '.';
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

        // chooses a random number to determine which type of message + corresponding gif will be sent
        const choice = randomNumber(1, 3);

        // yes messsages and gifs
        if (choice == 1) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(question, 'https://files.catbox.moe/3cvymb.gif')
                .setDescription(yes)
                .setImage(yesgif)
                .setColor('#646770');
            return message.channel.send({ embed });
        }
        // no messages and gifs
        else if (choice == 2) {
            const embed = new Discord.MessageEmbed()
                .setAuthor(question)
                .setDescription(no)
                .setImage(nogif)
                .setColor('#646770');
            return message.channel.send({ embed });
        }
        // later messages
        else {
            const embed = new Discord.MessageEmbed()
                .setAuthor(question)
                .setDescription(later)
                .setColor('#646770');
            return message.channel.send({ embed });
        }
    }
};
