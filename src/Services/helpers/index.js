"use strict";

const PostPaypal = require("./Paypal").PostPaypal;
const Stripe = require("./Stripe").Stripe;


module.exports = {
    PostPaypal,
    Stripe,
};