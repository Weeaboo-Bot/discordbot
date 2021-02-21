const Command = require('../../structures/Command');

module.exports = class SayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            aliases: ['copycat', 'echo', 'parrot'],
            group: 'fun',
            memberName: 'say',
            guildOnly: true,
            description: 'Makes me say something for you.',
            examples: ['!say [sentence]'],
            args: [
                {
                    key: 'sayMessage',
                    prompt: 'Please provide me a message to say!',
                    type: 'string',
                    default: 'N////A',
                },
            ],
        });
    }

    run(message, args) {
        let { sayMessage } = args;
        if ((sayMessage = 'N////A')) {
            return message.say('Please specify something for me to say!');
        }

        return message.say(sayMessage).catch(console.error);
    }
};
