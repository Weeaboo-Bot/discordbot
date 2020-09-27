const Discord = require('discord.js');
const Command = require('../../models/Command');

module.exports = class CompVisionCommand extends Command {
  constructor(client) {
    super(client, {
      name : 'compvision',
      group : 'utility',
      memberName : 'compvision',
      guildOnly : true,
      aliases : [ 'compvis', 'recg' ],
      description : 'Use Computer Vision to analyze an image'
    });
  }

  async run(message) {}
}