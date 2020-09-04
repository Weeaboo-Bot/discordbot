const Command = require('../../models/Command');
const tsun = [
    "N-No, it's not like I did it for you! I did it because I had freetime, that's all! ┐(￣ヘ￣;)┌",
    "I like you, you idiot! 💢",
    "BAKAAAAAAAAAAAAAAA!!!!! YOU'RE A BAKAAAAAAA!!!! 💢💢",
    "I'm just here because I had nothing else to do!",
    "Are you stupid?",
    "💢 You're such a slob!",
    "You should be grateful!",
    "You're free anyways, right?",
    "Don't misunderstand, it's not like I like you or anything... ( ￣＾￣)",
    "H-Hey.... (//・.・//)",
    "....T-Thanks.....",
    "B-Baka! 💢",
    "T-Tch! S-Shut up!",
    "I just had extra, so shut up and take it! 💢",
    "Can you be ANY MORE CLUELESS?",
    "HEY! It's a privilege to even be able to talk to me! You should be honored! 💢",
    "Geez, stop pushing yourself! You're going to get yourself hurt one day, you idiot!",
    "I-I am not a tsundere, you b-baka!",
    "💢 I'm only t-talking to you because I have nothing else to do, b-baka!",
    "Don't get the wrong idea! BAKA!",
    "I-I'm doing this p-purely for my own benefit. So d-don't misunderstand, you idiot!",
    "Urusai, urusai, urusai!! 💢",
    "I-It's not that I like you or anything, I just happened to make too much for lunch...",
    "Don't misunderstand...baka.",
    "B-baka! I am not a tsundere! 💢",
    "Na-nan des-ka?"
];


module.exports = class TsundereCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'tsundere',
            aliases: ['tsun'],
            group: 'fun',
            memberName: 'tsundere',
            guildOnly: true,
            description: 'Get a random tsundere quote!',
            examples: ['~tsundere'],
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }

    run(message) {
        return message.channel.send(tsun[Math.round(Math.random() * (tsun.length - 1))]);
    }
};