const Command = require('../../structures/Command');

module.exports = class TimeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'time',
            aliases: ['clock'],
            group: 'util',
            memberName: 'time',
            guildOnly: true,
            description: 'Shows the time for the given location!',
            examples: ['!time [city/country]'],
            throttling: {
                usages: 1,
                duration: 5,
            },
            args: [
                {
                    key: 'location',
                    type: 'string',
                    prompt: 'Please Enter a Location',
                },
            ],
        });
    }

    async run(message, { location }) {
        if (!location) {
            return message.channel.send(
                'Please specify a location for me to gather information from!'
            );
        }

        await this.apiReq
            .get(`https://www.timeapi.io/api/Time/current/zone?timeZone=${location}`)
            .then(function (res) {
                if (res.status !== 200) {
                    return message.channel.send(
                        '❎ | Could not connect to the server!'
                    );
                }

                const text = res.data;
                const response = `The time in **${text.timeZone}** is ${text.time} on ${text.date}`;
                return message.channel.send(response)
            })
            .catch(function (err) {
                message.channel.send(
                    `❎ | Location **${location}** was not found!`
                );
                return message.client.botLogger({
                        embed: message.client.errorMessage(
                            err,
                            message.client.errorTypes.API,
                            message.command.name
                        ),
                    });
            });
    }
};
