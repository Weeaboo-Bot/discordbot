const Command = require('../../structures/Command');
const Discord = require('discord.js');
const axios = require('axios');
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');
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
            throttling: {
                usages: 1,
                duration: 3,
            },
        });
    }

    async run(message) {
        const errMessage =
            errors[Math.round(Math.random() * (errors.length - 1))];
        if (!message.channel.nsfw) {
            message.react('💢');
            return message.channel.send(errMessage);
        }

        await axios
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
                    embed: errorMessage(
                        err,
                        ErrorEnum.API,
                        message.command.name
                    ),
                });
            });
    }
};
