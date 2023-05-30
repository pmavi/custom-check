const { CheckStripeKey } = require("../../libs/StripePaymentHelper");
const { CheckPayPalKey } = require("../../libs/PaypalPaymentHelper");
const { CheckCheckoutKey } = require("../../libs/CheckoutPaymentHelper");

const { PaymentMethods, Stores } = require("../models");

const array_column = (array, column) => {
    return array.map(item => item[column]);
};

module.exports.payment_methods = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req?.auth_store;

    let payment_methods = await PaymentMethods.findAll({
        where: {
            store_id: store_id
        }
    }).then((response) => {
        return response;
    });

    res.render("backend/PaymentMethods/payment_methods", {
        store_id: store_id,
        auth_user: auth_user,
        auth_store: auth_store,
        payment_methods: payment_methods,
        active_menu:"payment-methods",
    });
};

module.exports.add_payment_method = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req?.auth_store;

    if (req.method === "POST") {
        try {
            let request_body = req.body;
            request_body.user_id = auth_user?.id;
            request_body.created_by = auth_user?.id;

            if (!request_body.publishable_key || !request_body.secret || !request_body.method_name) {
                return res.json({
                    status: false,
                    message: 'One or more field missing from publish key,secret or method name'
                })
            }

            // Check Payment Method already exist ?
            if (await PaymentMethods.findOne({
                where: {
                    store_id: request_body?.store_id,
                    method_name: request_body.method_name,
                }
            })) {
                return res.json({
                    status: false,
                    message: "Payment Method already exists!",
                });
            }

            // Check Stripe Key Valid or Not
            if (request_body.method_name === "Stripe") {
                let stripe_response = await CheckStripeKey({
                    user_id: auth_user?.id,
                    secret: request_body?.secret,
                    publishable_key: request_body?.publishable_key
                });
                if (stripe_response == undefined) {
                    return res.json({
                        status: false,
                        message: "Invalid Secret key",
                    });
                }
            }

            // Check PayPal Key Valid or Not
            if (request_body.method_name === "PayPal") {
                let paypal_response = await CheckPayPalKey({
                    user_id: auth_user?.id,
                    secret: request_body?.secret,
                    publishable_key: request_body?.publishable_key
                });
                if (paypal_response == undefined || paypal_response == null) {
                    return res.json({
                        status: false,
                        message: "Invalid Keys!",
                    });
                }
            }

            // Check `Checkout.com` Key Valid or Not
            if (request_body.method_name === "Checkout.com") {
                let checkout_response = await CheckCheckoutKey(request_body);
                if (checkout_response == undefined || checkout_response == null) {
                    return res.json({
                        status: false,
                        message: "Invalid Keys!",
                    });
                }
            }

            await PaymentMethods.create(request_body);

            // Update Store Table with Payment Method True
            await Stores.update({
                payment_method: true
            }, {
                where: {
                    id: request_body?.store_id
                }
            });

            return res.json({
                status: true,
                message: "Payment method added succesfully",
                redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/payment-methods`,
            });
        } catch (error) {
            console.error("add_payment_method error------------", error);
            return res.json({
                status: false,
                message: 'Something went wrong.Please check your details!',
            });
        }
    }

    let payment_details = await PaymentMethods.findAll({
        where: {
            store_id: store_id,
            user_id: auth_user.id
        }
    }).then((response) => {
        return response;
    });
    let method_names = array_column(payment_details, 'method_name');

    res.render("backend/PaymentMethods/add_payment_method", {
        store_id: store_id,
        auth_user: auth_user,
        auth_store: auth_store,
        method_names: method_names,
        payment_method: payment_details,
        active_menu:"payment-methods",
    });
};

//payment live transactions
module.exports.edit_payment_method = async (req, res, next) => {
    const { store_id, id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req?.auth_store;

    if (req.method === "POST") {
        try {
            let request_body = req.body;

            // Check Stripe Key Valid or Not
            if (request_body.method_name === "Stripe") {
                let stripe_response = await CheckStripeKey({
                    user_id: auth_user?.id,
                    secret: request_body?.secret,
                    publishable_key: request_body?.publishable_key
                });
                if (stripe_response == undefined) {
                    return res.json({
                        status: false,
                        message: "Invalid Secret key",
                    });
                }
            }

            // Check PayPal Key Valid or Not
            if (request_body.method_name === "PayPal") {
                let paypal_response = await CheckPayPalKey({
                    user_id: auth_user?.id,
                    secret: request_body?.secret,
                    publishable_key: request_body?.publishable_key
                });
                if (paypal_response == undefined || paypal_response == null) {
                    return res.json({
                        status: false,
                        message: "Invalid Keys!",
                    });
                }
            }

            // Check `Checkout.com` Key Valid or Not
            if (request_body.method_name === "Checkout.com") {
                let checkout_response = await CheckCheckoutKey(request_body);
                if (checkout_response == undefined || checkout_response == null) {
                    return res.json({
                        status: false,
                        message: "Invalid Keys!",
                    });
                }
            }
            await PaymentMethods.update(request_body, {
                where: {
                    id: id
                }
            });
            return res.json({
                status: true,
                message: 'Payment method data updated',
                redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/payment-methods`,

            })

        } catch (error) {
            console.error("edit_payment_method error------------", error);
            return res.json({
                status: false,
                message: 'Something went wrong.Please check your details!'
            });
        }
    }

    let payment_method = await PaymentMethods.findOne({
        where: {
            id: id,
        }
    }).then((response) => {
        return response
    });

    res.render("backend/PaymentMethods/edit_payment_method", {
        store_id: store_id,
        auth_user: auth_user,
        auth_store: auth_store,
        payment_method: payment_method,
        active_menu:"payment-methods",
    });
};

module.exports.delete_payment_method = async (req, res, next) => {
    const { store_id } = req.params;

    if (req.method === "POST") {
        let request_body = req.body;
        try {
            await PaymentMethods.destroy({
                where: {
                    id: request_body?.payment_method_id
                }
            });
            return res.json({
                status: true,
                message: "Payment Method deleted succesfully",
                redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/payment-methods`,
            });
        } catch (error) {
            console.error("delete_shipping_rate error------------", error);
            return res.json({
                status: false,
                message: "Something went wrong!Please try again.",
            });
        }
    }
};