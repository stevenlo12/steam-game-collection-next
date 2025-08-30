'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    static associate(models) {
      Price.belongsTo(models.Game, { foreignKey: 'gameId', as: 'game' });
    }
  }

  Price.init({
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'games',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Price in USD'
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      comment: 'Original price in USD'
    },
    discountPercent: {
      type: DataTypes.INTEGER,
      comment: 'Discount percentage'
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: 'USD',
      comment: 'Currency code'
    },
    region: {
      type: DataTypes.STRING,
      defaultValue: 'US',
      comment: 'Region code'
    },
    isOnSale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Whether the game is on sale'
    },
    saleEndDate: {
      type: DataTypes.DATE,
      comment: 'Sale end date'
    },
    recordedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: 'When this price was recorded'
    }
  }, {
    sequelize,
    modelName: 'Price',
    tableName: 'prices',
    timestamps: true,
    indexes: [
      {
        fields: ['gameId']
      },
      {
        fields: ['recordedAt']
      },
      {
        fields: ['isOnSale']
      },
      {
        fields: ['gameId', 'recordedAt']
      }
    ]
  });

  return Price;
};


