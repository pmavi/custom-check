"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("carts", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            checkout_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "checkouts",
                },
                onDelete: "cascade",
                onUpdate: "cascade",
            },
            product_id: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            variant_id: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            title: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            price: {
                defaultValue: null,
                type: Sequelize.DECIMAL,
            },
            quantity: {
                defaultValue: null,
                type: Sequelize.INTEGER,
            },
            image: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("carts");
    },
};