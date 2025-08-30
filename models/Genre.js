'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {

    }
  }

  Genre.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Genre name'
    },
    description: {
      type: DataTypes.TEXT,
      comment: 'Genre description'
    },
    steamGenreId: {
      type: DataTypes.STRING,
      comment: 'Steam genre ID'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: 'Whether the genre is active'
    }
  }, {
    sequelize,
    modelName: 'Genre',
    tableName: 'genres',
    timestamps: true,
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['steamGenreId']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  return Genre;
};


