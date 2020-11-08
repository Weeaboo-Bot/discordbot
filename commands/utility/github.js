const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { error_log } = require('../../config');
const { errorMessage } = require('../../discord_functions/logHandler');
const ErrorEnum = require('../../discord_functions/errorTypes');
const log = require('../../discord_functions/consoleLogging');
const lodash = require('lodash');
const { request, GraphQLClient } = require('graphql-request');


module.exports = class GitHubCommand extends Command {
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
					prompt: 'Please enter a GitHub Username',
				},
				{
					key: 'repo_name',
					default: '',
					type: 'string',
					prompt: 'Please enter a Repo Name',
				},
			],
		});

	}
	async run(message, { username, repo_name }) {

		const query = `{
  user(login: $username) {
    email
    name
    repositories(last: 10) {
      nodes {
        name
        nameWithOwner
        url
        sshUrl
        createdAt
        updatedAt
        description
        homepageUrl
        
        
      }
      
      }
    }
  }}`;

		const graphlClient = new GraphQLClient(endpoint, { headers: {
			'Authorization': `Bearer ${auth}`,
			'Content-Type' : content_type,

		} });
		graphlClient.request(query, variables).then((data) => console.log(data));


	}


};