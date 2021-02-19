// Export error events
module.exports = (client, error) => {
    client.logger.error(error);
};
