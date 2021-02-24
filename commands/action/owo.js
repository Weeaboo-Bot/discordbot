const Command = require('../../structures/Command');
const Discord = require('discord.js');

module.exports = class OwoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'owo',
            aliases: ['whatsthis'],
            group: 'action',
            memberName: 'owo',
            guildOnly: true,
            description: "OWO what's this!",
            examples: ['!owo'],
        });
    }

    async run(message) {
        const reqURL = 'https://rra.ram.moe/i/r?type=owo';
        await message.command.axiosConfigo
            .get(reqURL)
            .then(function (res) {
                const embed = new Discord.MessageEmbed()
                    .setColor('#FBCFCF')
                    .setImage(`https://rra.ram.moe${res.data.path}`);
                return message.channel.send({ embed });
            })
            .catch(function (err) {
                message.client.channel.cache.get(message.client.errorLog).send({
                    embed: message.command.discordLogger.errorMessage(
                        err,
                        message.command.errorTypes.API,
                        message.command.name,
                        reqURL
                    ),
                });
            });
    }
};
