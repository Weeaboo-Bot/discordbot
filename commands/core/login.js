const Command = require('../../models/Command');
const Discord = require('discord.js');
const {error_log } = require('../../config');
const {errorMessage} = require('../../helpers/logHandler');
const ErrorEnum = require('../../helpers/errorTypes');
const log = require('../../helpers/consoleLogging');
const lodash = require('lodash');
const {fbApp} = require('../../index');


module.exports = class LoginCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'login',
            memberName: 'login',
            group: 'core',
            guildOnly: true,
            description: 'Will send an Email Login link to Firebase',
            args: [
                {
                    key: 'userEmail',
                    type: 'string',
                    prompt: 'Please enter your email address'
                }
            ]
        });

    }
    run(message, {userEmail}){




        const signinURL = 'https://weaboo-bot-b5f7a.web.app/signIn';
          message.say(`Please go to this URL to sign-in: ${signinURL}`)


    }


};