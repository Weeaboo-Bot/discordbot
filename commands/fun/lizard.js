const Command = require("../../models/Command");
const Discord = require("discord.js");
const axios = require("axios");
const { error_log } = require("../../config");
const { errorMessage } = require("../../helpers/logHandler");
const ErrorEnum = require("../../helpers/errorTypes");

module.exports = class LizardCommand extends Command {
  constructor(client) {
    super(client, {
      name: "lizard",
      aliases: ["liz"],
      group: "fun",
      memberName: "lizard",
      guildOnly: true,
      description: "Sends a random picture of a lizard!",
      examples: ["~lizard"],
      throttling: { usages: 1, duration: 5 },
    });
  }

  async run(message) {
    await axios
      .get("https://nekos.life/api/lizard")
      .then(function (res) {
        return message.channel.send({
          embed: new Discord.MessageEmbed()
            .setImage(res.data.url)
            .setDescription(`[Image URL](${res.data.url})`)
            .setFooter(
              "https://nekos.life/ ©",
              "https://nekos.life/static/lizard/010C.jpg"
            )
            .setColor("#71A3BE"),
        });
      })
      .catch(function (err) {
        message.client.channels.cache
          .get(error_log)
          .send({
            embed: errorMessage(err, ErrorEnum.API, message.command.name),
          });
      });
  }
};
