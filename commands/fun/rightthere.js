const Command = require('../../structures/Command');
const rightThere = require('../../assets/json/rightthere.json');

module.exports = class RightThereCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rightthere',
            aliases: ['goodshit', 'rthere'],
            group: 'fun',
            memberName: 'rightthere',
            guildOnly: true,
            description: 'Sends a random right there copypasta!',
            details:
                'May include NSFW language and elements or considered as spam.',
            examples: ['!rightthere'],
        });
    }

    run(message) {
        return message.channel.send(
            `${rightThere[Math.round(Math.random() * (rightThere.length - 1))]}`
        );
    }
};
