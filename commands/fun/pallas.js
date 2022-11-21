const Command = require('../../structures/Command');
const Discord = require('discord.js');
const request = require('node-superfetch');
const cheerio = require('cheerio');

const PALLAS_CAT_URL = 'https://www.google.com/search?q=pallas+cat&tbm=isch';

module.exports = class PallasCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pallas',
            aliases: ['pallascat'],
            group: 'fun',
            memberName: 'pallas',
            guildOnly: true,
            description: 'Sends a random picture of a pallas cat!',
            examples: ['!pallas'],
        });
    }

    async run(message) {
        try {
            const { text } = await this.apiReq.get(PALLAS_CAT_URL);
            const $ = cheerio.load(text);
            const setOfImages = $('')

        } catch (err) {
            // Send Error log to channel
            message.client.botLogger({
                embed: message.client.errorMessage(
                    err,
                    message.client.errorTypes.API,
                    message.command.name
                ),
            });
            // Tell the user about this error
            return msg.reply(
                `Oh no, an error occurred: \`${err.message}\`. Try again later!`
            );
        }
    }
};
