const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class TranslateCommand extends Command {
    constructor(client){
        super(client, {
            name:'translate',
            group: 'other',
            aliases: ['translatewords,translator'],
            memberName: 'translate',
            description: 'Translate the given input to the requested language',
            throttling: {
              usages: 2,
              duration: 10
            },
            args: [
              {
                key: 'input',
                type: 'string',
                prompt: 'What would you like to translate?'
              },
              {
                key: 'language',
                type: 'string',
                prompt: 'What language would you like to translate to?'
              }
            ]
          });
    }
    run(message, {input,language}) {


        
    }
}