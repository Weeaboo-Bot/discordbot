const Sequelize = require('sequelize');

class DatabaseConnection {
  constructor(config) {
    this.config = config;
  }

  createConnection() {
    const { dialect, database, username, password, ...options } = this.config;
    return new Sequelize(database, username, password, { dialect, ...options });
  }

  async connect() {
    try {
      this.sequelize = await this.createConnection();
      await this.sequelize.authenticate();
      console.log('Connection to database has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.sequelize.close();
  }
}

module.exports = async (config) => {
  const connection = new DatabaseConnection(config);
  await connection.connect();
  return connection;
};