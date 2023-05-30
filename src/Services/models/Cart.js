"use strict";

const Sq = require("sequelize");
const sequelize = require("../dbconfig");

const Checkouts = require("./Checkouts");

const Cart = sequelize.define(
    "carts",
    {
        id: {
            type: Sq.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        checkout_id: {
            type: Sq.INTEGER,
            references: {
                key: "id",
                model: "checkouts",
            },
        },
        product_id: {
            type: Sq.STRING,
            defaultValue: null,
        },
        variant_id: {
            type: Sq.STRING,
            defaultValue: null,
        },
        title: {
            type: Sq.STRING,
            defaultValue: null,
        },
        price: {
            type: Sq.DECIMAL,
            defaultValue: null,
        },
        quantity: {
            type: Sq.INTEGER,
            defaultValue: null,
        },
        image: {
            type: Sq.STRING,
            defaultValue: null,
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Cart;

// Cart.belongsTo(Checkouts, {
// foreignKey: "checkout_id",
// });