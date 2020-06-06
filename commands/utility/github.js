const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const {error_log } = require('../../config');
const {errorMessage} = require('../../functions/logHandler');
const ErrorEnum = require('../../functions/errorTypes');
const log = require('../../functions/consoleLogging');
const lodash = require('lodash');
const {fbApp} = require('../../index');


module.exports = class GitHubCommand extends Command{
    constructor(client) {
        super(client, {
            name: 'github',
            memberName: 'github',
            group: 'utility',
            description: 'Search GitHub for Repos, User Profiles, etc',
            args: [
                {
                    key: 'username',
                    default: '',
                    type: 'string',
                    prompt: 'Please enter a GitHub Username'
                },
                {
                    key: 'repo_name',
                    default: '',
                    type: 'string',
                    prompt: 'Please enter a Repo Name'
                }
            ]
        });

    }
    run(message, {username,repo_name}) {






    }


}