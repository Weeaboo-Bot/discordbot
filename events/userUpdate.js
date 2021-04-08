// Export user update events

module.exports = (client, oldUser, newUser) => {
    // Update user in db
    if (
        oldUser.username != newUser.username ||
        oldUser.discriminator != newUser.discriminator
    ) {
        client.logger.info(`${oldUser.tag} user tag changed to ${newUser.tag}`);
    }
};
