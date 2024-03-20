const Sequelize = require('sequelize');

class DatabaseConnection {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger
  }

  createConnection() {
    const { dialect, database, username, password, ...options } = this.config;
    return new Sequelize(database, username, password, { dialect, ...options });
  }

  async connect() {
    try {
      this.sequelize = await this.createConnection();
      await this.sequelize.authenticate();
      this.logger.info('Connection to database has been established successfully.');
    } catch (error) {
      this.logger.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.sequelize.close();
  }
}

module.exports = async (config, logger) => {
  const connection = new DatabaseConnection(config, logger);
  await connection.connect();
  return connection;
};