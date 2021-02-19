const Command = require('../../structures/Command');
const Jimp = require('jimp');

// remember to return before every promise
module.exports = class BonziCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bonzi',
            aliases: ['fact'],
            group: 'memes',
            guildOnly: true,
            clientPermissions: ['ATTACH_FILES'],
            memberName: 'bonzi',
            description: 'Makes Bonzi tell an interesting fact!',
            examples: ['~bonzi [message]'],
            throttling: {
                usages: 1,
                duration: 10,
            },
            args: [
                {
                    key: 'text',
                    prompt: 'Please provide Bonzi a message to say!',
                    type: 'string',
                    default: '',
                },
            ],
        });
    }

    async run(message, { text }) {
        if (text == '') {
            return message.channel.send(
                'Please provide something for Bonzi to say!'
            );
        }

        await message.channel.startTyping();

        const bonzi = await Jimp.read('assets/images/bonzi.png');
        const blank = await Jimp.read('assets/images/blank.png');

        const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

        blank.resize(175, 120);
        const fact = blank.print(font, 0, 0, text, 175);

        bonzi.composite(fact, 23, 12);
        bonzi.getBuffer(Jimp.MIME_PNG, async (err, buffer) => {
            await message.channel.send({
                files: [
                    {
                        name: 'bonzi.png',
                        attachment: buffer,
                    },
                ],
            });
            await message.channel.stopTyping();
        });

        return null;
    }
};
