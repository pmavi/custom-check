"use strict";

const fs = require("fs");

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("countries", {
            id: {
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            country_name: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            country_code3: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            country_code: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            currency: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            currency_name: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            currency_symbol: {
                defaultValue: null,
                type: Sequelize.STRING,
            },
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
        });




        // fs.readFile(`${__dirname}/sql/countries.sql`).then(async (sql) => {
        //     await queryInterface.sequelize.query(sql)
        // })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("countries");
    },
};