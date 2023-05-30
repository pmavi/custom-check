"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("buy_links", {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    key: "id",
                    model: "users",
                },
            },
            store_id: {
                type: Sequelize.UUID,
                references: {
                    key: "id",
                    model: "stores",
                },
            },
            buy_link_token: Sequelize.TEXT,
            product_ids: {
                type: Sequelize.ARRAY(Sequelize.TEXT),
                defaultValue: null,
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
            deleted_at: Sequelize.DATE,
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("buy_links");
    },
};