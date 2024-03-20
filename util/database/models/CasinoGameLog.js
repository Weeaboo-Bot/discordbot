'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CasinoGameLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CasinoGameLog.init({
    gameLogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    gameType: {
      type: DataTypes.ENUM,
      values: ['blackjack', 'poker', 'slots', 'roulette'],
      allowNull: false,

    },
    moveType: {
      type: DataTypes.ENUM,
      values: ['bet', 'win', 'loss', 'draw'],
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      references: {
        model: 'Player',
        key: 'userId',
        as: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      }
    }
  }, {
    sequelize,
    modelName: 'CasinoGameLog',
  });
  return CasinoGameLog;
};