"use strict";

const Sq = require("sequelize");
const sequelize = require("../dbconfig");

const UserSubscriptions = require("./UserSubscriptions");

const Users = sequelize.define(
    "users",
    {
        id: {
            type: Sq.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: Sq.STRING,
            defaultValue: null,
        },
        last_name: {
            type: Sq.STRING,
            defaultValue: null,
        },
        email: {
            type: Sq.STRING,
            defaultValue: null,
        },
        password: Sq.STRING,
        user_type: {
            defaultValue: "merchant",
            type: Sq.ENUM("admin", "merchant"),
        },
        avatar: {
            defaultValue: null,
            type: Sq.STRING,
        },
        email_verified_at: {
            defaultValue: null,
            type: Sq.DATE,
        },
        otp: {
            defaultValue: null,
            type: Sq.INTEGER,
        },
        reset_password_expires: {
            defaultValue: null,
            type: Sq.DATE,
        },
        user_status: {
            defaultValue: true,
            type: Sq.BOOLEAN,
        },
        stripe_customer_id: {
            defaultValue: null,
            type: Sq.STRING,
        },
        created_by: Sq.INTEGER,
        updated_by: Sq.INTEGER,
        deleted_by: Sq.INTEGER,
    },
    {
        timestamps: true,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        defaultScope: {
            attributes: { exclude: ["password"] },
        },
        scopes: {
            withPassword: { attributes: {} },
        },
    }
);

module.exports = Users;

Users.hasMany(UserSubscriptions, {
    foreignKey: "created_by",
});
