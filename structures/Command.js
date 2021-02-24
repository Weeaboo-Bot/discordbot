const { Command } = require('discord.js-commando');
const LogHandler = require('../util/logHandler');
const ErrorEnum = require('../assets/json/errorTypes.json');
const axios = require('axios');

module.exports = class WeabooCommand extends Command {
    constructor(client, info) {
        super(client, info);
        this.argsSingleQuotes = info.argsSingleQuotes || false;
        this.throttling = { usages: 1, duration: 5 };
        this.uses = 0;
        this.credit = info.credit || [];
        this.credit.push({
            name: 'Techie3445',
            url: 'https://github.com/sdoran35',
            reason: 'Code',
        });

        /**
         * Custom Discord Log Handler
         * @type {module.WeabooLogHandler}
         */
        this.discordLogger = new LogHandler();
        this.errorTypes = ErrorEnum;

        /**
         * Custom WeabooBot Axios Config
         * @type {AxiosInstance}
         */
        this.axiosConfig = axios.create();
        this.reqURL = '';
    }
};
