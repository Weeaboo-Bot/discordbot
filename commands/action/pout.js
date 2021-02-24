const Command = require('../../structures/Command');
const Discord = require('discord.js');

// remember to return before every promise
module.exports = class PoutCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pout',
            group: 'action',
            memberName: 'pout',
            guildOnly: true,
            description: 'uWaa??',
            examples: ['!pout'],
        });
    }

    async run(message) {
        const recipient = message.content.split(/\s+/g).slice(1).join(' ');
        const reqURL = 'https://rra.ram.moe/i/r?type=pout';
        await message.command.axiosConfig
            .get(reqURL)
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
                        embed: message.command.discordLogger.errorMessage(
                            error,
                            message.command.errorTypes.API,
                            message.command.name,
                            reqURL
                        ),
                    });
            });
    }
};
