const Command = require('../../structures/Command');
const tsun = require('../../assets/json/tsun.json');

module.exports = class TsundereCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tsundere',
            aliases: ['tsun'],
            group: 'fun',
            memberName: 'tsundere',
            guildOnly: true,
            description: 'Get a random tsundere quote!',
            examples: ['!tsundere'],
        });
    }

    run(message) {
        return message.channel.send(
            tsun[Math.round(Math.random() * (tsun.length - 1))]
        );
    }
};
