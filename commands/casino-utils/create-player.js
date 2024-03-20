const Command = require('../../structures/Command');
const moment = require('moment');
const { MessageEmbed } = require('discord.js');
const Player = require('../../database/models/Player');
const { Sequelize, Model, DataTypes } = require("sequelize");

module.exports = class CreatePlayer extends Command {
    constructor(client) {
        super(client, {
            name: 'create-player',
            aliases: ['create-casino-player'],
            group: 'casino-utils',
            memberName: 'create-player',
            description: 'Create a new Casino Player',
            args: [
                {
                    key: 'user',
                    prompt: 'Which user would you like to create in the casino',
                    type: 'member',
                    default: (msg) => msg.author,
                },
            ],
        });
    }

    async run(msg, { user }) {
        try {
            await msg.guild.members.cache.get(user.id).roles.add(msg.guild.roles.cache.find(role => role.name === 'Casino Player'));
            const newPlayer = await msg.client.dbHelper.createPlayer({
                userId: user.id,
                userName: user.username,
                userTag: user.tag,
                balance: 0,
            });
            msg.client.logger.info(`Successfully added role "${role.name}" to user "${member.user.username}"`);
            return msg.say(
                `Created new player ${user.tag} with ID ${newPlayer.id}`
            );
        } catch (error) {
            msg.client.botLogger({
                embed: msg.client.errorMessage(
                    error,
                    msg.client.errorTypes.DATABASE,
                    msg.command.name
                ),
            });
        }
    }
};
