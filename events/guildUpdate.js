// Export guild update events
module.exports = async (client, oldGuild, newGuild) => {

	if (oldGuild.name == newGuild.name) return;

	client.logger.info(
		`${oldGuild.name} server name changed to ${newGuild.name}`);

	try {
		const statusLog = client.channels.cache.get(client.statusLog);
		await statusLog.send(
			`${oldGuild.name} server name changed to ${newGuild.name}`);
		return null;
	}
	catch {
		return null;
	}
};
