const Command = require("../../models/Command");

const mock = ["I love Emilia!", "Astolfo is best girl!", "Traps are not gay!"];

// remember to return before every promise
module.exports = class MockCommand extends Command {
  constructor(client) {
    super(client, {
      name: "mock",
      guildOnly: true,
      aliases: ["sayas", "mockme"],
      group: "fun",
      memberName: "mock",
      clientPermissions: ["MANAGE_WEBHOOKS"],
      description: "Mocks the provided user with your text!",
      details: "This command works through webhooks!",
      examples: ["~mock [user] [text]"],
      throttling: { usages: 1, duration: 45 },
      args: [
        {
          key: "member",
          prompt: "Please provide a user for me to mock!",
          type: "member",
        },
        {
          key: "text",
          prompt: "Please provide me some text for this user to say!",
          type: "string",
          default: "none",
        },
      ],
    });
  }

  async run(message, { member, text }) {
    let name;

    if (!member.nickname) {
      name = member.user.username;
    } else {
      name = member.nickname;
    }

    if (text == "none") {
      text = mock[Math.round(Math.random() * (mock.length - 1))];
    }

    var hook = await message.channel.createWebhook(name, {
      avatar: member.user.displayAvatarURL({ format: "png", size: 128 }),
      reason: `${message.author.tag} is mocking ${member.user.tag}`,
    });

    message.delete();
    await hook.send(text);

    setTimeout(async function () {
      await hook.delete();
    }, 1000);
  }
};
