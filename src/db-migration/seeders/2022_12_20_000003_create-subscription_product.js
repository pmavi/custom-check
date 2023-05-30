"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert("subscription_products", [
            {
                object_id: "prod_N9LY8o5HhMk8JV",
                name: "Standard",
                description: "Testing the package with description",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                object_id: "prod_N9LY23BmFBnPdj",
                name: "Premium",
                description: "Testing the package with description",
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("subscription_products", null, {});
    },
};