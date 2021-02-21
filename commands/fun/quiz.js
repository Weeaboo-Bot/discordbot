const Command = require('../../structures/Command');
const quiz = require('./quiz.json');
const item = quiz[Math.floor(Math.random() * quiz.length)];
const filter = (response) => {
    return item.answers.some(
        (answer) => answer.toLowerCase() === response.content.toLowerCase()
    );
};

module.exports = class QuizCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'quiz',
            aliases: ['qz', 'quizme'],
            group: 'fun',
            memberName: 'quiz',
            guildOnly: true,
            description: 'Take a simple quiz',
            examples: ['!quiz [category]'],
            args: [
                {
                    key: 'category',
                    type: 'string',
                    prompt: 'What Category would you like to take a quiz in?',
                },
            ],
        });
    }

    run(message, { category }) {
        message.channel
            .awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then((collected) => {
                message.channel.send(
                    `${collected.first().author} got the correct answer!`
                );
            })
            .catch((collected) => {
                message.channel.send(
                    'Looks like nobody got the answer this time.'
                );
            });
    }
};
