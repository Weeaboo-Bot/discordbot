const { Command } = require('discord.js-commando');
const { yandex_key } = require('../../config')
const translate = require('translate');

module.exports = class TestCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'test',
            aliases: ['te', 'test', 'tes'],
            group: 'utility',
            memberName: 'test',
            guildOnly: true,
            description: 'Translates your text into the desired language!',
            examples: ['!test [language] [text]'],
            throttling: {
                usages: 1,
                duration: 10
            },

        });
    }
    run(message){
        var msg = translate('Hello world', { to: 'en', engine: 'yandex', key: yandex_key });

        message.say(msg)
    }

}