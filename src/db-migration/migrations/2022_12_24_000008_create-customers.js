"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("customers", {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,
            },
            store_id: {
                type: Sequelize.UUID,
                references: {
                    key: "id",
                    model: "stores",
                },
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
                unique: true,
                type: Sequelize.STRING,
            },
            phone: {
                unique: true,
                type: Sequelize.STRING,
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("customers");
    },
};