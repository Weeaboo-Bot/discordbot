const Discord = require("discord.js");
const Command = require("../../models/Command");
const lang = require("../../helpers/languages");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

module.exports = class TranslateCommand extends Command {
  constructor(client) {
    super(client, {
      name: "translate",
      memberName: "translate",
      aliases: ["translate-word", "translator", "trans"],
      description: "Translate a sentence",
      group: "utility",
      args: [
        {
          key: "langTo",
          type: "string",
          prompt: "Please enter the language to translate to",
        },
      ],
    });
  }

  async run(message, { langTo }) {
    message.channel
      .awaitMessages((m) => m.author.id == message.author.id, {
        max: 1,
        time: 15000,
      })
      .then((collected) => {
        axios
          .post(
            message.client.config.apiKeys.azure_translate_endpoint,
            { "api-version": "3.0", to: langTo },
            {
              headers: {
                "content-type": "application/json",
                "ocp-apim-subscription-key": "c1042bf508694d0d8aac20bb3f96519a",
                "x-clienttraceid": "993d3b03-eff4-4d9a-8ae0-15023368fcc2",
              },
              body: [{ text: "hello" }],
              json: true,
            }
          )
          .then(function (res) {
            console.log(res);
          });
      });
  }
};
