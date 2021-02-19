const Command = require('../../structures/Command');
const Discord = require('discord.js');
const booru = require('booru');
const errors = require('../../assets/json/errors');

module.exports = class YandereCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tbib',
            group: 'nsfw',
            memberName: 'tbib',
            guildOnly: true,
            description: 'Searches for images on TBIB!',
            details: 'This command can only be used in NSFW channels!',
            examples: ['~tbib <search>'],
        });
    }

    run(message) {
        const errMessage =
            errors[Math.round(Math.random() * (errors.length - 1))];
        if (!message.channel.nsfw) {
            message.react('💢');
            return message.channel.send(errMessage);
        }

        if (
            message.content.toUpperCase().includes('LOLI') ||
            message.content.toUpperCase().includes('GORE')
        )
            return message.channel.send(
                'That kind of stuff is not allowed! Not even in NSFW channels!'
            );

        const query = message.content.split(/\s+/g).slice(1).join(' ');

        booru
            .search('tbib', [query], { limit: 1, random: true })
            .then(booru.commonfy)
            .then((images) => {
                for (const image of images) {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(
                            `TBIB ${query}`,
                            'https://b.catgirlsare.sexy/NrAI.png'
                        )
                        .setDescription(`[Image URL](${image.common.file_url})`)
                        .setImage(image.common.file_url)
                        .setColor('#E89F3E');
                    message.channel.send({ embed });
                }
            })
            .catch((err) => {
                if (err.name === 'booruError') {
                    return message.channel.send(
                        `No results found for **${query}**!`
                    );
                } else {
                    return message.channel.send(
                        `No results found for **${query}**!`
                    );
                }
            });
    }
};
