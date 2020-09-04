const Command = require('../../models/Command');
const Discord = require('discord.js');
const axios = require('axios');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');
const wanakana = require('wanakana');

module.exports = class JishoCommand extends Command {
        constructor(client) {
            super(client, {
                name: 'jisho',
                aliases: ['japanese', 'define', 'kanji'],
                group: 'utility',
                memberName: 'jisho',
                guildOnly: true,
                description: 'Searches for Japanese words and kanji on Jisho!',
                examples: ['~jisho [word/kanji/japanese/romaji]'],
                throttling: {
                    usages: 1,
                    duration: 10
                },
                args: [{
                    key: 'word',
                    prompt: 'Please provide me with a word to get the definition of!',
                    type: 'string'
                }]
            });
        }

        async run(message, {word}) {

                var query = encodeURI(word);

                var res = await axios.get('https://jisho.org/api/v1/search/words', {
                    params: {
                        'keyword': word
                    }
                })
                    .then(function(res){


                        if (res.data.data.length > 0) {
                            var content = res.data.data[0];
                            var senses = content.senses[0].english_definitions[0];
                            //senses = senses.replace(/\"/g, '').replace(/,/g, '\n');
                            senses = senses.substring(1, senses.length - 1);
                            senses = senses.replace(/^/gm, '•\u2000');
                            senses = senses.replace(/\\/g, "");

                            const embed = new Discord.MessageEmbed()
                                .setAuthor(`${content.japanese[0].word ? content.japanese[0].word : content.japanese[0].reading}`)
                                .setThumbnail('https://a.safe.moe/FB0Qi.png')
                                .setColor('#9678D2')
                                .setDescription(content.is_common ? '`Common Word`' : '`Not a Common Word`' + `\n[External Link](https://jisho.org/search/${query})`)
                                .addField(`❯\u2000\Definition`, `${senses}`)
                                .addBlankField()
                                .addField(`❯\u2000\Reading`, `•\u2000**Kana:** ${content.japanese[0].reading ? content.japanese[0].reading : '`N/A`'}\n\•\u2000**Romāji:** ${wanakana.toRomaji(content.japanese[0].reading)}`);
                            return message.channel.send({ embed });

                        } else {
                            return message.channel.send(`No results found for **${word}**!`);
                        }

                    })
                    .catch(function(err){
                        message.client.channels.cache.get(error_log).send({embed: errorMessage(err,ErrorEnum.API,message.command.name)});
                    });





    }
};