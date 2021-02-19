const Command = require('../../structures/Command');
const Discord = require('discord.js');
const axios = require('axios');
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');

// remember to return before every promise
module.exports = class PoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pout',
            group: 'action',
            memberName: 'pout',
            guildOnly: true,
            description: 'uWaa??',
            examples: ['~pout'],
            throttling: {
                usages: 1,
                duration: 3,
            },
        });
    }

    async run(message) {
        const recipient = message.content.split(/\s+/g).slice(1).join(' ');

        await axios
            .get('https://rra.ram.moe/i/r?type=pout')
            .then(function (res) {
                if (!recipient) {
                    const embed = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send(
                        `${message.author} has started pouting!`,
                        { embed: embed }
                    );
                } else {
                    const embed2 = new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${res.data.path}`);
                    return message.channel.send(
                        `${message.author} pouts at ${recipient}!`,
                        { embed: embed2 }
                    );
                }
            })
            .catch(function (error) {
                message.client.channels.cache
                    .get(message.client.errorLog)
                    .send({
                        embed: errorMessage(
                            error,
                            ErrorEnum.API,
                            message.command.name
                        ),
                    });
            });
    }
};
