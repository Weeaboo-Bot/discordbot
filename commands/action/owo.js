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
        await this.apiReq
            .get('https://rra.ram.moe/i/r?type=owo')
            .then(function (res) {
                const embed = new Discord.MessageEmbed()
                    .setColor('#FBCFCF')
                    .setImage(`https://rra.ram.moe${res.data.path}`);
                return message.channel.send({ embed });
            })
            .catch(function (err) {
                message.client.botLogger.send({
                    embed: message.client.errorMessage(
                        err,
                        message.client.errorTypes.API,
                        message.command.name
                    ),
                });
            });
    }
};
