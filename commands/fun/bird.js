const Command = require('../../structures/Command');
const Discord = require('discord.js');
const up = true;

module.exports = class BirdCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bird',
            aliases: ['birb', 'burb', 'birbo'],
            group: 'fun',
            memberName: 'bird',
            guildOnly: true,
            description: 'Sends a random picture of a bird!',
            examples: ['!bird'],
        });
    }

    async run(message) {
        const reqURL = 'http://random.birb.pw/tweet/';
        if (!up) {
            await message.command.axiosConfig
                .get(reqURL)
                .then(function (res) {
                    const msg = new Discord.MessageEmbed()
                        .setImage(`http://random.birb.pw/img/${res.data.image}`)
                        .setFooter(
                            'http://random.birb.pw/ ©',
                            'http://random.birb.pw/img/BPVpe.jpg'
                        )
                        .setColor('#71A3BE');

                    return message.channel.send({ embed: msg });
                })
                .catch(function (err) {
                    message.client.channel.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: message.command.discordLogger.errorMessage(
                                err,
                                message.command.errorTypes.API,
                                message.command.name,
                                reqURL
                            ),
                        });
                });
        } else {
            await message.say('Bird Img API is Offline');
        }
    }
};
