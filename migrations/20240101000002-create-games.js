'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      steamId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      shortDescription: {
        type: Sequelize.TEXT
      },
      headerImage: {
        type: Sequelize.STRING
      },
      backgroundImage: {
        type: Sequelize.STRING
      },
      releaseDate: {
        type: Sequelize.DATE
      },
      developer: {
        type: Sequelize.STRING
      },
      publisher: {
        type: Sequelize.STRING
      },
      metacriticScore: {
        type: Sequelize.INTEGER
      },
      metacriticUrl: {
        type: Sequelize.STRING
      },
      isFree: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      price: {
        type: Sequelize.DECIMAL(10, 2)
      },
      originalPrice: {
        type: Sequelize.DECIMAL(10, 2)
      },
      discountPercent: {
        type: Sequelize.INTEGER
      },
      categories: {
        type: Sequelize.JSON
      },
      languages: {
        type: Sequelize.JSON
      },
      systemRequirements: {
        type: Sequelize.JSON
      },
      platforms: {
        type: Sequelize.JSON
      },
      lastUpdated: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('games', ['steamId']);
    await queryInterface.addIndex('games', ['title']);
    await queryInterface.addIndex('games', ['developer']);
    await queryInterface.addIndex('games', ['publisher']);
    await queryInterface.addIndex('games', ['releaseDate']);
    await queryInterface.addIndex('games', ['isActive']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('games');
  }
};


