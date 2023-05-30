const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { SubscriptionProducts, SubscriptionPackage } = require("../../models");

module.exports.get_product = async (req, res, next) => {
    await SubscriptionProducts.findAll({
        attributes: ["id", "object_id", "name", "description"],
    })
        .then(async function (response) {
            return res.json({
                status: true,
                data: response,
            });
        })
        .catch((error) => {
            console.log("get_product error-----------", error);
            return res.json({
                error: error,
                status: false,
                message: "Something went wrong. Please try again.",
            });
        });
};

module.exports.create_product = async (req, res, next) => {
    const request_body = req.body;
    const auth_user = req.auth_user;

    await stripe.products
        .create({
            name: request_body.name,
            description: request_body.description,
        })
        .then(async function (response) {
            console.log("create_product response-----------", response);

            let subscription_product = {
                object_id: response.id,
                name: request_body.name,
                description: request_body.description,
                created_by: auth_user?.id,
            };
            await SubscriptionProducts.create(subscription_product)
                .then(function (response) {
                    return res.json({
                        status: false,
                        data: response,
                    });
                })
                .catch((error) => {
                    console.log("create_product error-----------", error);
                    return res.json({
                        error: error,
                        status: false,
                        message: "Something went wrong. Please try again.",
                    });
                });
        })
        .catch((error) => {
            console.log("create_product error-----------", error);
            return res.json({
                error: error,
                status: false,
                message: "Something went wrong. Please try again or reach out to support if the issue persists. or reach out to support if the issue persists.",
            });
        });
};

module.exports.get_subscription_packages = async (req, res, next) => {
    await SubscriptionPackage.findAll({
        order: [["id", "ASC"]],
        attributes: ["id", "subscription_product_id", "package_name", "billing_cycle", "price"],
    })
        .then(function (response) {
            return res.json({
                status: true,
                data: response,
            });
        })
        .catch((error) => {
            console.log("get_subscription_packages error-----------", error);
            return res.json({
                error: error,
                status: false,
                message: "Something went wrong. Please try again or reach out to support if the issue persists. or reach out to support if the issue persists.",
            });
        });
};

module.exports.create_subscription_packages = async (req, res, next) => {
    const request_body = req.body;
    const auth_user = req.auth_user;

    let subscription_product = await SubscriptionProducts.findOne({
        where: {
            id: request_body.subscription_product_id,
        },
    });
    if (subscription_product) {
        await stripe.prices
            .create({
                currency: "usd",
                product: subscription_product?.object_id,
                unit_amount: request_body.price * 100,
                nickname: request_body.package_name,
                recurring: { interval: request_body.billing_cycle },
            })
            .then(async function (customer) {
                let subscription_package = {
                    stript_object_id: customer.id,
                    stript_object_type: customer.object,
                    stript_object_description: "",

                    price: request_body.price,
                    subscription_product_id: request_body.subscription_product_id,
                    package_name: request_body.package_name,
                    billing_cycle: request_body.billing_cycle,
                    created_by: auth_user?.id,
                };

                await SubscriptionPackage.create(subscription_package)
                    .then(function (response) {
                        return res.json({
                            status: true,
                            data: response,
                        });
                    })
                    .catch((error) => {
                        console.log("create_subscription_packages error -----------------", error);
                        return res.json({
                            error: error,
                            status: false,
                            message: "Something went wrong. Please try again or reach out to support if the issue persists. or reach out to support if the issue persists.",
                        });
                    });
            })
            .catch((error) => {
                console.log("create_subscription_packages error -----------------", error);
                return res.json({
                    status: false,
                    message: "Something went wrong. Please try again or reach out to support if the issue persists. or reach out to support if the issue persists.",
                });
            });
    } else {
        return res.json({
            status: false,
            message: "Bad request",
        });
    }
};