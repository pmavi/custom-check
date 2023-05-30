"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("custom_domain", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            store_id: {
                type: Sequelize.UUID,
                references: {
                    key: "id",
                    model: "stores",
                },
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "users",
                },
            },
            domain_host_name: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            verified_status:{
                defaultValue: false,
                type: Sequelize.BOOLEAN, 
            },
            points_to_domain:{
                defaultValue: null,
                type: Sequelize.STRING,   
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("custom_domain");
    },
};