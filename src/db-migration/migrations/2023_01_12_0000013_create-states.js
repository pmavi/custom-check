"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("states", {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            state_name: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            country_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            country_code: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            state_code: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            type: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("states");
    },
};