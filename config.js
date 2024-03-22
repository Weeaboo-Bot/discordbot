// config.js
const dotenv = require('dotenv');
dotenv.config();

exports.logs = {
    GENERAL_CHAT: process.env.GENERAL_CHAT,
    BOT_COMMANDS_CHAT: process.env.BOT_COMMAND_CHAT,
    BOT_LOG: process.env.BOT_LOG,
};

exports.discord = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    DISCORD_PREFIX: process.env.DISCORD_PREFIX,
    DISCORD_WEBHOOK_ID: process.env.DISCORD_WEBHOOK_ID,
    DISCORD_WEBHOOK_TOKEN: process.env.DISCORD_WEBHOOK_TOKEN,
    DISCORD_LOGGING_WEBHOOK_ID: process.env.DISCORD_LOGGING_WEBHOOK_ID,
    DISCORD_LOGGING_WEBHOOK_TOKEN: process.env.DISCORD_LOGGING_NWEBHOOK_TOKEN,
    DISCORD_OWNER_ID: process.env.DISCORD_OWNER_ID,
    DISCORD_INVITE: process.env.DISCORD_INVITE,
    GUILD_ID: process.env.GUILD_ID,
    CASINO_CHANNEL: process.env.CASINO_CHANNEL,
};

exports.sentry = {
    SENTRY_DSN: process.env.SENTRY_DSN,
};

exports.api = {
    ALPHA_KEY: process.env.ALPHA_VANTAGE,
    LOGIN_URL: 'https://us-central1-weaboo-bot-73b07.cloudfunctions.net/api/login',
    GOOGLE_KEY: process.env.GOOGLE_API_KEY,
    GOOGLE_CSE_KEY: process.env.GOOGLE_CSE_KEY,
    WEATHER_KEY: process.env.WEATHER_KEY,
    YOUTUBE_KEY: process.env.GOOGLE_API_KEY,
    SUCCESS_EMOJI_ID: process.env.SUCCESS_EMOJI_ID,
    FAILURE_EMOJI_ID: process.env.FAILURE_EMOJI_ID,
    AIRNOW_API: process.env.AIRNOW_API,
};

exports.database = {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    dialectOptions: {
        bigNumberStrings: true,
    }
};
