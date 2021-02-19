const Command = require('../../structures/Command');
const Discord = require('discord.js');
const axios = require('axios').default;
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');

module.exports = class OwoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'owo',
            aliases: ['whatsthis'],
            group: 'action',
            memberName: 'owo',
            guildOnly: true,
            description: "OWO what's this!",
            examples: ['~owo'],
            throttling: {
                usages: 1,
                duration: 3,
            },
        });
    }

    async run(message) {
        await axios
            .get('https://rra.ram.moe/i/r?type=owo')
            .then(function (res) {
                const embed = new Discord.MessageEmbed()
                    .setColor('#FBCFCF')
                    .setImage(`https://rra.ram.moe${res.data.path}`);
                return message.channel.send({ embed });
            })
            .catch(function (err) {
                message.client.channel.cache.get(message.client.errorLog).send({
                    embed: errorMessage(
                        err,
                        ErrorEnum.API,
                        message.command.name
                    ),
                });
            });
    }
};
