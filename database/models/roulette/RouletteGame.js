const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const RouletteGame = sequelize.define('RouletteGame', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.fn('gen_random_uuid'),
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });

  // Optional: Add associations with other models here (e.g., User)

  return RouletteGame;
};
