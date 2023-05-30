const Sq = require("sequelize");
const sequelize = require("../dbconfig");

const Users = require("./Users");

const UserSubscriptionBillings = sequelize.define(
    "user_subscription_billings",
    {
        id: {
            primaryKey: true,
            type: Sq.INTEGER,
            autoIncrement: true,
        },
        user_id: {
            type: Sq.INTEGER,
            references: {
                key: "id",
                model: "users",
            },
        },
        store_id: {
            type: Sq.UUID,
            references: {
                key: "id",
                model: "stores",
            },
        },
        user_subscription_id: {
            type: Sq.INTEGER,
            references: {
                key: "id",
                model: "user_subscriptions",
            },
        },
        subscription_package_id: {
            type: Sq.INTEGER,
            references: {
                key: "id",
                model: "subscription_packages",
            },
        },
        card_detail_id: {
            type: Sq.INTEGER,
            references: {
                key: "id",
                model: "user_subscription_card_details",
            },
        },
        stripe_subscription_id: {
            defaultValue: null,
            type: Sq.TEXT,
        },
        stripe_customer_id: {
            defaultValue: null,
            type: Sq.TEXT,
        },
        stripe_invoice_id: {
            defaultValue: null,
            type: Sq.TEXT,
        },
        stripe_invoice_number: {
            defaultValue: null,
            type: Sq.TEXT,
        },
        stripe_invoice_pdf: {
            defaultValue: null,
            type: Sq.TEXT,
        },
        billing_cycle: Sq.ENUM("month", "year"),
        price: Sq.STRING,
        start_date: Sq.DATE,
        end_date: Sq.DATE,
        created_by: Sq.INTEGER,
        updated_by: Sq.INTEGER,
        status: Sq.ENUM("Active", "Inactive"),
    },
    {
        timestamps: true,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = UserSubscriptionBillings;