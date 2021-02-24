const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { randomRange } = require('../../util/Util');

module.exports = class MoeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'moe',
            aliases: ['awwnime', 'loli'],
            group: 'anime',
            memberName: 'moe',
            guildOnly: true,
            description: 'Cute anime girls!',
            examples: ['!moe'],
        });
    }
    //thanks random code on reddit that helped me figure this shit out
    async run(message) {
        const reqURL = 'https://www.reddit.com/r/awwnime.json';
        await message.command.axiosConfig.get(reqURL, {
            params: {
                sort: 'top',
                t: 'week',
            },
        })
            .then(res => {
                return message.channel.send({embed : new Discord.MessageEmbed()
                        .setColor('#A187E0')
                        .setTitle('Here is a cute pic!')
                        .setImage(res.data.data.children[randomNumber(0,res.data.data.children.length)].data.url)
                        .setFooter('Provided by /r/awwnime')
                });
            })
            .catch(err => {
                message.client.channel.cache
                    .get(message.client.errorLog)
                    .send({
                        embed: message.command.discordLogger.errorMessage(
                            err,
                            message.command.errorTypes.API,
                            message.command.name,
                            reqURL + '?sort=top&t=week'
                        ),
                    });
            })
    }
}