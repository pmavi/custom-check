"use strict";

const Users = require("./Users");
const Stores = require("./Stores");
const UserSubscriptions = require("./UserSubscriptions");
const UserSubscriptionBillingDetails = require("./UserSubscriptionBillingDetails");
const UserSubscriptionBillings = require("./UserSubscriptionBillings");
const UserSubscriptionCardDetails = require("./UserSubscriptionCardDetails");

const CustomizeCheckout = require("./CustomizeCheckout");
const CustomizeAboutSections = require("./CustomizeAboutSections");
const ShippingRates = require("./ShippingRates");
const PaymentMethods = require("./PaymentMethods");

const SubscriptionProducts = require("./SubscriptionProducts");
const SubscriptionPackage = require("./SubscriptionPackage");


const BuyLinks = require("./BuyLinks");
const Translations = require("./Translations");

const AutomaticDiscounts = require("./AutomaticDiscounts");

const Customers = require("./Customers");
const Orders = require("./Orders");
const Checkouts = require("./Checkouts");
const Cart = require("./Cart");

const CustomDomain = require("./CustomDomain");

SubscriptionPackage.belongsTo(SubscriptionProducts, {
    foreignKey: "subscription_product_id",
});

module.exports = {
    Users,
    UserSubscriptions,
    UserSubscriptionBillingDetails,
    UserSubscriptionBillings,
    UserSubscriptionCardDetails,

    Stores,
    CustomizeCheckout,
    CustomizeAboutSections,

    ShippingRates,
    PaymentMethods,

    BuyLinks,
    Translations,

    SubscriptionPackage,
    SubscriptionProducts,

    Customers,
    AutomaticDiscounts,
    Orders,
    Checkouts,
    Cart,

    CustomDomain
};