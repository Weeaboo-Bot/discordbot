const Command = require('../../structures/Command');
const Discord = require('discord.js');
const db = require('../../util/db');
const DB = new db();
module.exports = class CreateLogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'createlog',
            aliases: ['gen-log', 'generate-log'],
            group: 'util',
            memberName: 'generate-log',
            description: "Create new log channel",
            details: 'Only the bot owner(s) may use this command.',
            ownerOnly: true,
            guarded: true,
            args: [
                {
                    key: 'log_name',
                    prompt:
                        'Please provide me with a log name',
                    type: 'string',
                },
            ],
        });
    }

    async run(msg, { log_name }) {

       const newChannel = await msg.guild.channels.create(log_name);
       msg.client.botLogger = newChannel;
       await DB.createDocument('logs', {
           'id': 'weabooLog',
           'log_name': log_name,
           'log_channel_id': newChannel.id
       }, false);
       const hookName = 'LogHook';
        newChannel.createWebhook(hookName, {
            avatar: msg.client.user.displayAvatarURL({ format: 'png' }),
            reason: 'Weaboo Bot Log Chat Webhook'
        })
            .then((res) => {
                msg.client.webhook = new Discord.WebhookClient(
                    res.id,
                    res.token,
                    { disableMentions: 'everyone' }
                );

                DB.createDocument('webhooks',
                    {
                        'id':'weabooWebhook',
                        'webhook_id': res.id,
                        'webhook_name': hookName,
                        'webhook_token': res.token
                    },false);
            })
            .catch(msg.client.logger.error)
    }

};
