"use strict";

const Sq = require("sequelize");
const sequelize = require("../dbconfig");

const Cart = require("./Cart");

const Checkouts = sequelize.define(
    "checkouts",
    {
        id: {
            type: Sq.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        shop_id: {
            type: Sq.UUID,
            allowNull: false,
        },
        product_id: {
            type: Sq.INTEGER,
            defaultValue: null,
        },
        variant_id: {
            type: Sq.INTEGER,
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
    },
    {
        timestamps: true,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = Checkouts;

Checkouts.hasMany(Cart, {
    foreignKey: "checkout_id",
});