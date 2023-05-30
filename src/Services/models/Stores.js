"use strict";

const Sq = require("sequelize");
const sequelize = require("../dbconfig");

const Users = require("./Users");
const CustomizeCheckout = require("./CustomizeCheckout");
const Translations = require("./Translations");

const Stores = sequelize.define(
    "stores",
    {
        id: {
            primaryKey: true,
            type: Sq.INTEGER,
            defaultValue: Sq.UUIDV4,
        },
        user_id: Sq.INTEGER,
        store_type: {
            defaultValue: "shopify",
            type: Sq.ENUM("shopify", "woocommerce"),
        },
        store_name: {
            defaultValue: null,
            type: Sq.STRING,
        },
        store_domain: {
            defaultValue: null,
            type: Sq.STRING,
        },
        store_token: {
            defaultValue: null,
            type: Sq.STRING,
        },
        store_status: {
            defaultValue: false,
            type: Sq.BOOLEAN,
        },
        user_subscription_id: {
            defaultValue: null,
            type: Sq.INTEGER,
        },
        shipping_rate: {
            defaultValue: false,
            type: Sq.BOOLEAN,
        },
        payment_method: {
            defaultValue: false,
            type: Sq.BOOLEAN,
        },
        customize_checkout_preview: {
            defaultValue: false,
            type: Sq.BOOLEAN,
        },
        customize_checkout_publish: {
            defaultValue: false,
            type: Sq.BOOLEAN,
        },
    },
    {
        paranoid: true,
        timestamps: true,
        freezeTableName: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    }
);

module.exports = Stores;

Stores.belongsTo(Users, {
    foreignKey: "id",
});

const { ChangeLanguage } = require("../../libs/Helper");
Stores.afterCreate(async (response, options) => {
	
    // Create CustomizeCheckout default value Against the store
    await CustomizeCheckout.create({
        user_id: response?.user_id,
        store_id: response?.id,
        accent_color: "#012970",
        button_color: "#1A1A1A",
        error_color: "#B00020",
        font_size: 16,
        require_phone_number: true,
        require_address_number: true,
        check_accepts_marketing: true,
        display_timer: true,
        display_branding: true,
        display_discount: true,
    });

    // Create Translations default value Against the store
    let default_language = await ChangeLanguage("english");
    default_language = {
        ...default_language,
        user_id: response?.user_id,
        store_id: response?.id,
        translation_language: "english",
    };
    await Translations.create(default_language);
});