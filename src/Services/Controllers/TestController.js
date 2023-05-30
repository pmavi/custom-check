const { Stores } = require("../models");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports.test = async (req, res, next) => {
    try {
        await Stores.create({
            user_id: 1,
            store_name: "testappwithnodejs",
            store_domain: "testappwithnodejs.myshopify.com",
            store_token: "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",
        }, { individualHooks: true });

        return res.send({
            status: true,
            message: "records deleted successfully!",
        });
    } catch (error) {
        console.log("test error -------------", error);
        return res.send("No record found!!");
    }
};

module.exports.test_subscription = async (req, res, next) => {
    try {
        /*** Genrate Subscription agains customer ***/
        let stripe_subscription = await stripe.subscriptions.create({
            customer: "cus_NAuJ6eKnovF66R",
            items: [
                {
                    price: "price_1MP2rfG3TgT7c7M0jTHgFhFi"
                }
            ],
        });
        console.log("test_subscription stripe_subscription -------------", stripe_subscription);

        return res.send({
            status: true,
            message: "Subscription created successfully!",
        });

    } catch (error) {
        console.log("test_subscription error -------------", error);
        return res.send("No record found!!");
    }
};