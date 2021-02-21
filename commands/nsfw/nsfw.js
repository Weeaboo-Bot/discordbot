const Command = require('../../structures/Command');
const Discord = require('discord.js');
const axios = require('axios');
const { errorMessage } = require('../../util/logHandler');
const ErrorEnum = require('../../util/errorTypes.json');
const { disgustP } = require('../../assets/json/actions.json');
const { SubsToSearch } = require('./subs');

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = class NSFWCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nsfw',
            description: 'Search for NSFW Pics based on requested SubList',
            memberName: 'nsfw',
            group: 'nsfw',
            guildOnly: true,
            nsfw: true,
            aliases: ['nsfwpics', 'pornpics'],
            examples: ['!nsfw 4knsfw', '!nsfw pussy'],
            args: [
                {
                    key: 'subList',
                    type: 'string',
                    prompt: `Please enter the category to search\n**Options**: ${Object.keys(
                        SubsToSearch
                    )} `,
                },
            ],
        });
    }
    async run(message, { subList }) {
        if (
            !message.guild.channels.cache.find(
                (channel) => channel.id == message.channel.id
            ).nsfw
        ) {
            return message.say('This is **NOT** a NSFW Channel!!!!');
        }

        if (Object.keys(SubsToSearch).includes(subList)) {
            const subIndex = getRndInteger(0, SubsToSearch[subList].length);

            await axios
                .get(
                    `https://www.reddit.com/r/${SubsToSearch[subList][subIndex]}.json`
                )
                .then(function (res) {
                    const index = getRndInteger(
                        0,
                        res.data.data.children.length
                    );

                    const embed = new Discord.MessageEmbed()
                        .setFooter(`${subList}`)
                        .setDescription(
                            `[Image URL](${res.data.data.children[index].data.permalink})`
                        )
                        .setImage(res.data.data.children[index].data.url)
                        .setColor('#A187E0');
                    return message.channel.send({ embed });
                })
                .catch(function (error) {
                    // handle error

                    message.client.channels.cache
                        .get(message.client.errorLog)
                        .send({
                            embed: errorMessage(
                                error,
                                ErrorEnum.API,
                                message.command.name
                            ),
                        });
                });
        } else {
            message.say('This Section is not searchable thru Subs');
        }
    }
};
