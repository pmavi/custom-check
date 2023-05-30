"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("checkouts", {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            shop_id: {
                type: Sequelize.UUID,
                // references: {
                // key: "id",
                // model: "stores",
                // },
            },
            product_id: {
                defaultValue: null,
                type: Sequelize.INTEGER,
            },
            variant_id: {
                defaultValue: null,
                type: Sequelize.INTEGER,
            },
            price: {
                defaultValue: null,
                type: Sequelize.DECIMAL,
            },
            quantity: {
                defaultValue: null,
                type: Sequelize.INTEGER,
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("checkouts");
    },
};