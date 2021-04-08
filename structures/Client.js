const { CommandoClient } = require('discord.js-commando');
const Discord = require('discord.js');
const activities = require('../assets/json/activity');
const leaveMsgs = require('../assets/json/leave-messages');
const { errorMessage, auditMessage, readyMessage, roleMessage, guildMessage, newMessage, dmMessage } = require('../util/logHandler');
const { readdir } = require('fs');
const { join, resolve } = require('path');
const { fail } = require('../assets/json/emojis.json');

const GROUPS = [
    ['action', 'Action'],
    ['anime', 'Anime'],
    ['core', 'Core'],
    ['fun', 'Fun'],
    ['games-mp', 'Multi-Player Games'],
    ['games-sp', 'Single-Player Games'],
    ['info', 'Info'],
    ['memes', 'Memes'],
    ['moderation', 'Moderation'],
    ['music', 'Music Commands'],
    ['news', 'News'],
    ['nsfw', 'NSFW'],
    ['numbers', 'Number Commands'],
    ['owner', 'Hidden + Owner'],
    ['text', 'Text Commands'],
    ['util', 'Utility'],
    ['general', 'General'],
    ['loyal', 'Loyalty Program Commands'],
    ['other', 'Other'],
];
/*

 */
Discord.Structures.extend('Guild', function (Guild) {
    class MusicGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.musicData = {
                queue: [],
                isPlaying: false,
                nowPlaying: null,
                songDispatcher: null,
                volume: 0.6,
            };
        }
    }
    return MusicGuild;
});

module.exports = class WeabooClient extends CommandoClient {
    constructor(config, options = {}) {
        super(options);

        this.registry
            .registerDefaultTypes()
            .registerTypesIn(join(__dirname, '../types'))
            .registerGroups(GROUPS)
            .registerDefaultCommands({
                help: false,
                ping: false,
                prefix: false,
                eval: false,
                commandState: false,
                unknownCommand: false,
            })
            .registerCommandsIn(join(__dirname, '../commands'));

        /**
         * Create logger
         */
        this.logger = require('../util/logger');

        this.on('commandError', (command, err) =>
            this.logger.error(`[COMMAND:${command.name}]\n${err.stack}`)
        );

        this.on('voiceStateUpdate', async (___, newState) => {
            if (
                newState.member.user.bot &&
                !newState.channelID &&
                newState.guild.musicData.songDispatcher &&
                newState.member.user.id === this.user.id
            ) {
                newState.guild.musicData.queue.length = 0;
                newState.guild.musicData.songDispatcher.end();
            }
        });

        /**
         * Discord API Stuff
         * @type {string}
         */
        this.token = config.discord.DISCORD_TOKEN;
        this.successEmoji = config.api.SUCCESS_EMOJI_ID;
        this.commandPrefix = config.discord.DISCORD_PREFIX;

        /**
         * API keys
         * @type {Object}
         */
        this.apiKeys = config.api;

        /**
         * Weaboo's owner ID
         * @type {string}
         */
        this.ownerId = config.discord.DISCORD_OWNER_ID;

        /**
         * Weaboo's Log IDs
         */

        /**
         * Utility functions
         * @type {Object}
         */
        this.utils = require('../util/Util');
        this.errorMessage = errorMessage;
        this.auditMessage = auditMessage;
        this.readyMessage = readyMessage;
        this.roleMessage = roleMessage;
        this.guildMessage = guildMessage;
        this.newMessage = newMessage;
        this.dmMessage = dmMessage;
        this.errorTypes = require('../assets/json/errorTypes.json');
        this.logger.info('Initializing...');
        this.games = new Discord.Collection();
        this.activities = activities;
        this.leaveMessages = leaveMsgs;
        this.botLogger = this.channels.fetch(config.logs.BOT_LOG);
        this.webhook = new Discord.WebhookClient(
            config.discord.DISCORD_WEBHOOK_ID,
            config.discord.DISCORD_WEBHOOK_TOKEN,
            {disableMentions: 'everyone'}
        );

    }

    /**
     * Loads all available events
     * @param {string} path
     */
    loadEvents(path) {
        readdir(path, (err, files) => {
            if (err) this.logger.error(err);
            files = files.filter((f) => f.split('.').pop() === 'js');
            if (files.length === 0) return this.logger.warn('No events found');
            this.logger.info(`${files.length} event(s) found...`);
            files.forEach((f) => {
                const eventName = f.substring(0, f.indexOf('.'));
                const event = require(resolve(__basedir, join(path, f)));
                super.on(eventName, event.bind(null, this));
                delete require.cache[
                    require.resolve(resolve(__basedir, join(path, f)))
                ]; // Clear cache
                this.logger.info(`Loading event: ${eventName}`);
            });
        });
        return this;
    }

    /**
     * Loads all available commands
     */
    loadGroups() {
        this.logger.info('Loading groups...');
        this.logger.info(`${this.registry.groups.size} groups(s) found...`);
        this.registry.groups.forEach((group) => {
            this.logger.info(`Loading group: ${group.name}`);
        });
        return this;
    }

    /**
     * Loads all available commands
     */
    loadCommands() {
        this.logger.info('Loading commands...');
        this.logger.info(`${this.registry.commands.size} commands(s) found...`);
        this.registry.commands.forEach((command) => {
            this.logger.info(`Loading command: ${command.name}`);
        });
        return this;
    }

    /**
     * Checks if user is the bot owner
     * @param {User} user
     */
    isOwner(user) {
        if (user.id === this.ownerId) return true;
        else return false;
    }

    /**
     * Creates and sends system failure embed
     * @param {Guild} guild
     * @param {string} error
     * @param {string} errorMessage
     */
    sendSystemErrorMessage(guild, error, errorMessage) {
        const systemChannel = guild.channels.cache.get(this.errorLog);

        // Check channel and permissions
        if (
            !systemChannel ||
            !systemChannel.viewable ||
            !systemChannel
                .permissionsFor(guild.me)
                .has(['SEND_MESSAGES', 'EMBED_LINKS'])
        ) {
            return;
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor(
                `${this.user.tag}`,
                this.user.displayAvatarURL({ dynamic: true })
            )
            .setTitle(`${fail} System Error: \`${error}\``)
            .setDescription(
                `\`\`\`diff\n- System Failure\n+ ${errorMessage}\`\`\``
            )
            .setTimestamp()
            .setColor(guild.me.displayHexColor);
        systemChannel.send(embed);
    }
};
