const { CommandoClient } = require('discord.js-commando');
const Discord = require('discord.js');
const { errorMessage, auditMessage, readyMessage, roleMessage, guildMessage, newMessage, dmMessage, statusMessage } = require('../util/logHandler');
const { readdir } = require('fs');
const { join, resolve } = require('path');
const { fail } = require('../assets/json/emojis.json');
const DBHelper = require('../database/db-helper');
const sequelize = require('../database/db-connection');
const CasinoUtils = require('../util/casinoUtils');
const Util = require('../util/Util');

const GROUPS = [
    ['action', 'Action'],
    ['anime', 'Anime'],
    ['core', 'Core'],
    ['casino-utils', 'Casino Utils'],
    ['fun', 'Fun'],
    ['games-mp', 'Multi-Player Games'],
    ['games-sp', 'Single-Player Games'],
    ['info', 'Info'],
    ['moderation', 'Moderation'],
    ['numbers', 'Number Commands'],
    ['owner', 'Hidden + Owner'],
    ['text', 'Text Commands'],
    ['util', 'Utility'],
];

module.exports = class WeabooClient extends CommandoClient {
    constructor(config, options = {}) {
        super(options);

        this.registry
            .registerDefaultTypes()
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
        this.logger.info(`[STARTING DISCORD BOT] Initializing...`);
        this.prefix = config.discord.DISCORD_PREFIX;
        this.logger.info(`[PREFIX] ${config.discord.DISCORD_PREFIX}`);
        this.BOT_LOG = config.logs.BOT_LOG;
        this.guildId = config.discord.GUILD_ID;
        this.apiKeys = config.api;
        this.ownerId = config.discord.DISCORD_OWNER_ID;
        this.utils = new Util();
        this.casinoUtils = new CasinoUtils();
        // Create the Casino and db
        this.DAILY_TOKEN_AMOUNT = config.api.DAILY_TOKEN_AMOUNT;
        this.casinoChannel = config.logs.CASINO_CHANNEL;
        this.casinoUsers = new Discord.Collection();
        this.casinoGameLog = new Discord.Collection();
        this.casinoGames = new Discord.Collection();
        this.casinoMapping = new Discord.Collection();
        this.database = sequelize;
        this.dbHelper = new DBHelper(this.casinoUsers, this.casinoGames, this.casinoGameLog, this.casinoMapping, this.logger);
        // Setup logging
        this.on('commandError', (command, err) =>
        this.logger.error(`[COMMAND:${command.name}]\n${err.stack}`)
    );
        this.errorMessage = errorMessage;
        this.auditMessage = auditMessage;
        this.readyMessage = readyMessage;
        this.roleMessage = roleMessage;
        this.guildMessage = guildMessage;
        this.statusMessage = statusMessage;
        this.newMessage = newMessage;
        this.dmMessage = dmMessage;
        this.statusTypes = require('../assets/json/status-types.json');
        this.errorTypes = require('../assets/json/errorTypes.json');
        this.botLogger = (logMessage) => {
            this.channels.fetch(config.logs.BOT_LOG)
                .then((channel) => {
                    channel.send(logMessage);
                }
                ).catch((err) => {
                    this.logger.error(err);
                }
                );
        };
        this.webhook = new Discord.WebhookClient(
            config.discord.DISCORD_WEBHOOK_ID,
            config.discord.DISCORD_WEBHOOK_TOKEN,
            { disableMentions: 'everyone' }
        );
        this.loggingWebhook = new Discord.WebhookClient(
            config.discord.DISCORD_LOGGING_WEBHOOK_ID,
            config.discord.DISCORD_LOGGING_WEBHOOK_TOKEN,
            { disableMentions: 'everyone' }
        );

    }

    /**
     * Loads all available events
     * @param {string} path
     */
    loadEvents(path) {
        this.logger.info('[EVENTS] Loading events...');
        readdir(path, (err, files) => {
            if (err) this.logger.error(err);
            files = files.filter((f) => f.split('.').pop() === 'js');
            if (files.length === 0) return this.logger.warn('No events found');
            this.logger.info(`[EVENTS] ${files.length} event(s) found...`);
            files.forEach((f) => {
                const eventName = f.substring(0, f.indexOf('.'));
                const event = require(resolve(__basedir, join(path, f)));
                super.on(eventName, event.bind(null, this));
                delete require.cache[
                    require.resolve(resolve(__basedir, join(path, f)))
                ]; // Clear cache
            });
        });
        return this;
    }

    /**
     * Loads all available commands
     */
    loadGroups() {
        this.logger.info('[GROUPS] Loading groups...');
        this.logger.info(`[GROUPS] ${this.registry.groups.size} groups(s) found...`);
        return this;
    }

    /**
     * Loads all available commands
     */
    loadCommands() {
        this.logger.info('[COMMANDS] Loading commands...');
        this.logger.info(`[COMMANDS] ${this.registry.commands.size} commands(s) found...`);
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
        const systemChannel = guild.channels.cache.get(this.BOT_LOG);

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
