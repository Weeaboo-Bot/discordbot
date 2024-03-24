const { Sequelize } = require('sequelize');
const config = require('../config').database;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  dialectOptions: config.dialectOptions,
});

// Test connection (optional)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('[DATABASE] DB Connection Completed.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
