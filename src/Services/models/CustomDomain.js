"use strict";

const Sq = require("sequelize");
const sequelize = require("../dbconfig");


const CustomDomain = sequelize.define(
    "custom_domain",
    {
        id: {
            type: Sq.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        store_id: {
            type: Sq.UUID,
            references: {
                key: "id",
                model: "stores",
            },
        },
        user_id: {
            type: Sq.INTEGER,
            references: {
                key: "id",
                model: "users",
            },
        },
        domain_host_name: {
            defaultValue: null,
            type: Sq.STRING,
        },
        verified_status:{
            defaultValue: false,
            type: Sq.BOOLEAN, 
        },
        points_to_domain:{
            defaultValue: null,
            type: Sq.STRING,   
        },
    },
    {
        timestamps: true,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = CustomDomain;
