const Command = require('../../structures/Command');

module.exports = class SpeakCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'speak',
            memberName: 'speak',
            aliases: ['bottts'],
            group: 'fun',
            description: 'Make the Bot TTS',
            guildOnly: false,
            args: [
                {
                    key: 'query',
                    type: 'string',
                    prompt: 'Input some text for me to speak!',
                },
            ],
        });
    }
    run(message, { query }) {
        return message.channel.send(query, {
            tts: true,
        });
    }
};
