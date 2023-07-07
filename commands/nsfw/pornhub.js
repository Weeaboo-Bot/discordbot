const Command = require('../../structures/Command');
const Discord = require('discord.js');
const { PornHub } = require('pornhub.js');
const { errorMessage } = require('../../util/logHandler');
const errors = require('../../assets/json/errors');
const pornhub = new PornHub();

module.exports = class PornHubCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'pornhub',
            group: 'nsfw',
            memberName: 'pornhub',
            guildOnly: true,
            description: 'Searches for videos on Pornhub!',
            details: 'This command can only be used in NSFW channels!',
            examples: ['~pornhub [search]'],
            args: [
                {
                    key: 'search',
                    type: 'string',
                    prompt: 'Please enter something to search for!',
                },
            ],
        });
    }

    async run(message, { search }) {
        const errMessage =
            errors[Math.round(Math.random() * (errors.length - 1))];
        if (!message.channel.nsfw) {
            message.react('💢');
            return message.channel.send(errMessage);
        }

        try {
            await pornhub.searchVideo(search)
                .then(function (res) {
                    res.data.forEach(item => {
                       const embed = new Discord.MessageEmbed()
                               .setTitle(item.title)
                               .setImage(item.preview)
                               .addField('HD: ',item.hd)
                               .addField('Video Length',item.duration)
                               .addField('Video URL', item.url)
                               .setURL(item.url);
                        message.channel.send({ embed: embed});
                    })
                })
                .catch(function (error) {
                    message.client.botLogger({
                        embed: message.client.errorMessage(
                            error,
                            message.client.errorTypes.API,
                            message.command.name,
                            search
                        ),
                    });
                });

            return null;
        } catch (err) {
            return message.channel.send(`No results found for **${search}**`);
        }
    }
};
