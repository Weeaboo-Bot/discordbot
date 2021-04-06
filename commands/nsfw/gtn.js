const Command = require('../../structures/Command');
const Discord = require('discord.js');
const errors = require('../../assets/json/errors');

module.exports = class GTNCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'gtn',
            aliases: ['nsfwcomics'],
            group: 'nsfw',
            memberName: 'gtn',
            guildOnly: true,
            description: 'Finds a GreenTeaNeko comic!',
            details: 'This command can only be used in NSFW channels!',
            examples: ['~gtn'],
        });
    }

    async run(message) {
        const errMessage =
            errors[Math.round(Math.random() * (errors.length - 1))];
        if (!message.channel.nsfw) {
            await message.react('💢');
            return message.channel.send(errMessage);
        }

        await this.apiReq
            .get('https://rra.ram.moe/i/r', {
                params: {
                    nsfw: true,
                },
            })
            .then(function (res) {
                return message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setColor('#FBCFCF')
                        .setImage(`https://rra.ram.moe${res.data.path}`),
                });
            })
            .catch(function (err) {
                message.client.channel.cache.get(message.client.errorLog).send({
                    embed: message.client.errorMessage(
                        err,
                        message.client.errorTypes.API,
                        message.command.name
                    ),
                });
            });
    }
};
