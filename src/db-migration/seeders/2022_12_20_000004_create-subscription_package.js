"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert("subscription_packages", [
            {
                stript_object_id: "price_1MP2rFG3TgT7c7M05l9kS7BB",
                stript_object_type: "price",
                stript_object_description: "Testing the package with description",
                subscription_product_id: 1,
                package_name: "Standard",
                billing_cycle: "month",
                price: 39,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                stript_object_id: "price_1MP2rfG3TgT7c7M0jTHgFhFi",
                stript_object_type: "price",
                stript_object_description: "Testing the package with description",
                subscription_product_id: 1,
                package_name: "Premium",
                billing_cycle: "month",
                price: 199,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("subscription_packages", null, {});
    },
};