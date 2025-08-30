'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('prices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'games',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      originalPrice: {
        type: Sequelize.DECIMAL(10, 2)
      },
      discountPercent: {
        type: Sequelize.INTEGER
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD'
      },
      region: {
        type: Sequelize.STRING,
        defaultValue: 'US'
      },
      isOnSale: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      saleEndDate: {
        type: Sequelize.DATE
      },
      recordedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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
    await queryInterface.addIndex('prices', ['gameId']);
    await queryInterface.addIndex('prices', ['recordedAt']);
    await queryInterface.addIndex('prices', ['isOnSale']);
    await queryInterface.addIndex('prices', ['gameId', 'recordedAt']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('prices');
  }
};


