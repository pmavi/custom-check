"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          key: "id",
          model: "customers",
        },
      },
      discount_id: {
        defaultValue: null,
        type: Sequelize.INTEGER,
      },
      first_name: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      last_name: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      phone: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      address: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      zipcode: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      city: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      country: {
        defaultValue: null,
        type: Sequelize.STRING,
      },
      status: {
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  },
};
