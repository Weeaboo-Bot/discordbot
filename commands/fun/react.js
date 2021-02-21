const Command = require('../../structures/Command');

module.exports = class ReactCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'react',
            guildOnly: true,
            aliases: ['reactions', 'reaction'],
            group: 'fun',
            memberName: 'react',
            wait: 0.1,
            description: 'Reacts on the given message ID!',
            examples: ['!react [message ID] [text]'],
            args: [
                {
                    key: 'inputMsg',
                    prompt: 'Please provide me a message to react on!',
                    type: 'message',
                },
                {
                    key: 'text',
                    prompt: 'Please provide me some text to render!',
                    type: 'string',
                },
            ],
        });
    }

    async run(message, { inputMsg, text }) {
        const msg = await message.channel.send(
            `🔄 | Reacting to **${inputMsg.author.username}**'s message...`
        );

        for (const c of text.toLowerCase()) {
            if (c in map) {
                try {
                    await inputMsg.react(map[c]);
                } catch (err) {
                    message.client.logger.error(err);
                }
            }
        }

        return msg.edit(
            `✅ | Successfully reacted on **${inputMsg.author.username}**'s message with ${text}!`
        );
    }
};

const map = {
    a: '🇦',
    b: '🇧',
    c: '🇨',
    d: '🇩',
    e: '🇪',
    f: '🇫',
    g: '🇬',
    h: '🇭',
    i: '🇮',
    j: '🇯',
    k: '🇰',
    l: '🇱',
    m: '🇲',
    n: '🇳',
    o: '🇴',
    p: '🇵',
    q: '🇶',
    r: '🇷',
    s: '🇸',
    t: '🇹',
    u: '🇺',
    v: '🇻',
    w: '🇼',
    x: '🇽',
    y: '🇾',
    z: '🇿',
    0: '0⃣',
    1: '1⃣',
    2: '2⃣',
    3: '3⃣',
    4: '4⃣',
    5: '5⃣',
    6: '6⃣',
    7: '7⃣',
    8: '8⃣',
    9: '9⃣',
    '#': '#⃣',
    '*': '*⃣',
    '!': '❗',
    '?': '❓',
};
