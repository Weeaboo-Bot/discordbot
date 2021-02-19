// Export reconnecting events
module.exports = (client, info) => {
	client.logger.info('Reconnecting to the server...' + info);
};
