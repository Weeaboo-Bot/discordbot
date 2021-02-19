// Export disconnect events
module.exports = (client, info) => {
    client.logger.info('Disconnected from the server...' + info);
};
