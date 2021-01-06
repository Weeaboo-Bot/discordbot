const { MessageEmbed } = require('discord.js');
module.exports = async (client, message) => {
	if(message.author.bot) return undefined;

	if(message.channel.type == 'dm') {
		if (message.content.startsWith(message.client.prefix)) return;
		const channel = client.channels.cache.get(client.dmLog);
		
		const embed = new MessageEmbed()
				.setAuthor(message.author.tag, message.author.displayAvatarURL())
				.setDescription(message.content)
				.setColor('#D48AD8')
				.setTimestamp();
		return channel.send({ embed });
	}

	//  if (!message.channel.(client.user.id).has('SEND_MESSAGES')) return undefined;


	if(message.content.toUpperCase().includes('PRESS F')) {
		await message.react('🇫');
		return null;
	}

	if(message.content.toUpperCase().includes('NYA')) {
		await message.react('🐱');
		return null;
	}

	if(message.content.toUpperCase().includes('BAKA')) {
		await message.react('💢');
		return null;
	}

	const hasText = Boolean(message.content);
	const hasImage = message.attachments.size !== 0;
	const hasEmbed = message.embeds.length !== 0;
	if (message.author.bot || (!hasText && !hasImage && !hasEmbed)) return;
	const origin = client.phone.find(call => call.origin.id === message.channel.id);
	const recipient = client.phone.find(call => call.recipient.id === message.channel.id);
	if (!origin && !recipient) return;
	const call = origin || recipient;
	if (call.originDM && call.startUser.id !== message.author.id) return;
	if (!call.adminCall && (message.guild && (!message.channel.topic || !message.channel.topic.includes('<weaboo:phone>')))) return;
	if (!call.active) return;
	if (call.adminCall && message.guild.id === call.origin.guild.id && !client.isOwner(message.author)) return;
	try {
		await call.send(origin ? call.recipient : call.origin, message, hasText, hasImage, hasEmbed);
	}
	catch {
		return; // eslint-disable-line no-useless-return
	}
	return null;
};
