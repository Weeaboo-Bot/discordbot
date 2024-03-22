const sequelize = require('../../db-connection');

  const RouletteGameLog = sequelize.define('RouletteGameLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.fn('gen_random_uuid'),
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'RouletteGame',
        key: 'id',
      },
    },
    eventAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    event: {
      type: DataTypes.ENUM(['PLAYER_JOINED', 'PLAYER_PLACED_BET', 'PLACED_BETS_CLOSED', 'WHEEL_SPUN', 'BALL_LANDED', 'WINNINGS_DISTRIBUTED', 'ROUND_ENDED', 'GAME_ENDED']),
      allowNull: false,
    },
    winningNumber: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    playerId: {
      type: DataTypes.STRING,
      defaultValue: null,
      references: {
        model: 'Player',
        key: 'id',
      },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    // Additional event-specific data (optional)
  });

  RouletteGameLog.belongsTo(RouletteGame, { foreignKey: 'gameId' });  // Define association with Game model
  RouletteGameLog.belongsTo(Player, { foreignKey: 'playerId' });

  // Optional: Add associations with other models here (e.g., Player, Bet)

module.exports = RouletteGameLog;
