const Discord = require('discord.js');
const Command = require('../../models/Command');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const async = require('async');

module.exports = class CompVisionCommand extends Command{
	constructor(client) {
		super(client, {
			name: 'compvision',
			group: 'utility',
			memberName: 'compvision',
			guildOnly: true,
			aliases: ['compvis','recg'],
			description: 'Use Computer Vision to analyze an image'
		});
		
	}
	
	async run(message){
		function computerVision() {
			async.series([
				async function () {
				
				
				}
	}
	
}