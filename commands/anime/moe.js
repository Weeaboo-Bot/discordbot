const Command = require('../../structures/Command');
const Discord = require('discord.js');
const randomPuppy = require('random-puppy');

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

    run(message) {
        randomPuppy('awwnime')
            .then((url) => {
                console.log(url);
                const embed = new Discord.MessageEmbed()
                    .setFooter('awwnime')
                    .setDescription(`[Image URL](${url})`)
                    .setImage(url)
                    .setColor('#A187E0');
                return message.channel.send({ embed });
            })
            .catch(function (error) {
                // handle error
                message.client.botLogger({embed: errorMessage(error,ErrorEnum.API,message.command.name)});
            });
    }
};
