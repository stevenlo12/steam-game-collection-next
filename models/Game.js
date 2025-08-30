'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      Game.hasMany(models.Price, { foreignKey: 'gameId', as: 'prices' });
    }
  }

  Game.init({
    steamId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Steam App ID'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Game title'
    },
    description: {
      type: DataTypes.TEXT,
      comment: 'Game description'
    },
    shortDescription: {
      type: DataTypes.TEXT,
      comment: 'Short game description'
    },
    headerImage: {
      type: DataTypes.STRING,
      comment: 'Header image URL'
    },
    backgroundImage: {
      type: DataTypes.STRING,
      comment: 'Background image URL'
    },
    releaseDate: {
      type: DataTypes.DATE,
      comment: 'Game release date'
    },
    developer: {
      type: DataTypes.STRING,
      comment: 'Game developer'
    },
    publisher: {
      type: DataTypes.STRING,
      comment: 'Game publisher'
    },
    metacriticScore: {
      type: DataTypes.INTEGER,
      comment: 'Metacritic score'
    },
    metacriticUrl: {
      type: DataTypes.STRING,
      comment: 'Metacritic review URL'
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether the game is free'
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Current price in USD'
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Original price in USD'
    },
    discountPercent: {
      type: DataTypes.INTEGER,
      comment: 'Discount percentage'
    },
    categories: {
      type: DataTypes.JSON,
      comment: 'Game categories (Single-player, Multi-player, etc.)'
    },
    languages: {
      type: DataTypes.JSON,
      comment: 'Supported languages'
    },
    systemRequirements: {
      type: DataTypes.JSON,
      comment: 'System requirements'
    },
    platforms: {
      type: DataTypes.JSON,
      comment: 'Supported platforms (Windows, Mac, Linux)'
    },
    lastUpdated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'Last time data was updated'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether the game is still active on Steam'
    }
  }, {
    sequelize,
    modelName: 'Game',
    tableName: 'games',
    timestamps: true,
    indexes: [
      {
        fields: ['steamId']
      },
      {
        fields: ['title']
      },
      {
        fields: ['developer']
      },
      {
        fields: ['publisher']
      },
      {
        fields: ['releaseDate']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  return Game;
};


