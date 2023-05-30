"use strict";

const { ShippingRates, Stores } = require("../models");

module.exports.shipping_rates = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req?.auth_store;

    let shipping_rates = await ShippingRates.findAll({
        where: {
            store_id: store_id,
        }
    }).then((response) => {
        return response;
    });

    res.render("backend/ShippingRate/shipping_rates", {
        store_id: store_id,
        auth_user: auth_user,
        auth_store: auth_store,
        shipping_rates: shipping_rates,
        active_menu: "shipping-rates",
    });
};

module.exports.add_shipping_rate = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req?.auth_store;

    if (req.method === "POST") {
        try {
            let request_body = req.body;
            console.log("----request", request_body)
            request_body.user_id = auth_user?.id;
            request_body.created_by = auth_user?.id;
            request_body.shipping_rate_min_amount = request_body?.shipping_rate_min_amount || 0;
            request_body.shipping_rate_max_amount = request_body?.shipping_rate_max_amount || 0;
            request_body.shipping_rate_min_weight = request_body?.shipping_rate_min_weight || 0;
            request_body.shipping_rate_max_weight = request_body?.shipping_rate_max_weight || 0;

            if (request_body.shipping_rate_max_amount < request_body.shipping_rate_min_amount) {
                return res.json({
                    status: false,
                    message: "Minimum cart subtotal should be less than maximum cart subtotal"
                });
            }

            if (request_body.shipping_rate_max_weight < request_body.shipping_rate_min_weight) {
                return res.json({
                    status: false,
                    message: "Minimum weight should be less than maximum weight "
                });
            }

            await ShippingRates.create(request_body);

            // Update Store Table with Payment Method True
            await Stores.update({ shipping_rate: true }, {
                where: {
                    id: request_body?.store_id
                }
            });

            return res.json({
                status: true,
                message: "Shipping rates added succesfully",
                redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/shipping-rates`,
            });

        } catch (error) {
            console.log("add_shipping_rate error------------", error);
            return res.json({
                status: false,
                message: "Something went wrong!Please try again.",
            });
        }
    }

    res.render("backend/ShippingRate/add_shipping_rate", {
        store_id: store_id,
        auth_user: auth_user,
        auth_store: auth_store,
        active_menu: "shipping-rates",
    });
};

module.exports.edit_shipping_rate = async (req, res, next) => {
    const { store_id, id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req?.auth_store;

    if (req.method === "POST") {
        try {

            let request_body = req.body;
            request_body.user_id = auth_user?.id;
            request_body.updated_by = auth_user?.id;

            request_body.shipping_rate_min_amount = request_body?.shipping_rate_min_amount || 0;
            request_body.shipping_rate_max_amount = request_body?.shipping_rate_max_amount || 0;
            request_body.shipping_rate_min_weight = request_body?.shipping_rate_min_weight || 0;
            request_body.shipping_rate_max_weight = request_body?.shipping_rate_max_weight || 0;

            let shipping_rate_id = request_body?.shipping_rate_id;
            delete request_body?.shipping_rate_id;

            if (request_body.shipping_rate_max_amount < request_body.shipping_rate_min_amount) {
                return res.json({
                    status: false,
                    message: "Minimum cart subtotal should be less than maximum cart subtotal"
                });
            }

            if (request_body.shipping_rate_max_weight < request_body.shipping_rate_min_weight) {
                return res.json({
                    status: false,
                    message: "Minimum weight should be less than maximum weight "
                });
            }

            await ShippingRates.update(request_body, {
                where: {
                    id: shipping_rate_id
                }
            });

            return res.json({
                status: true,
                message: "Shipping Rate Updated succesfully",
                redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/shipping-rates`,
            });

        } catch (error) {
            console.log("edit_shipping_rate error------------", error);
            return res.json({
                status: false,
                message: "Something went wrong!Please try again.",
            });
        }
    }

    let shipping_rate = await ShippingRates.findOne({
        where: {
            id: id,
            store_id: store_id
        },
    }).then((response) => {
        return response;
    });

    res.render("backend/ShippingRate/edit_shipping_rate", {
        store_id: store_id,
        auth_user: auth_user,
        auth_store: auth_store,
        shipping_rate: shipping_rate,
        active_menu: "shipping-rates",
    });
};

module.exports.delete_shipping_rate = async (req, res, next) => {
    if (req.method === "DELETE") {
        let request_body = req.body;

        try {
            await ShippingRates.destroy({
                where: {
                    id: request_body?.shipping_rate_id
                }
            });
            return res.json({
                status: true,
                message: "Shipping Rate delete succesfully",
                redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/shipping-rates`,
            });
        } catch (error) {
            console.log("delete_shipping_rate error------------", error);
            return res.json({
                status: false,
                message: "Something went wrong!Please try again.",
            });
        }
    }
};