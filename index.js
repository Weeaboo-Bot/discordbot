const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config/discord-config.json');

const client = new Discord.Client();
const queue = new Map();
client.commands = new Discord.Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});


client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

  const serverQueue = queue.get(message.guild.id);
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if(command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
  }

  try {
    command.execute(message,args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});



// login to Discord with your app's token
client.login(token);