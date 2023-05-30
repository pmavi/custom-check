const axios = require("axios");
const request = require("request-promise");
const models = require("../../models");
const SCOPES = require("../../scopes/scopes.json");

module.exports.StoreConnect = async (req, res, next) => {
    const auth_user = req.auth_user;

    if (req.method === "POST") {
        const request_body = req.body;

        if (request_body?.store_name) {
            try {
                let store_name = request_body.store_name;
                let store_url = `https://${store_name}.myshopify.com`;

                let findStore = await axios(store_url)
                    .then(async (response) => {
                        return response;
                    })
                    .catch(function (error) {
                        if (error?.response?.status == "404") {
                            return res.json({
                                status: false,
                                message: "Shopify store not valid",
                            });
                        }
                    });

                let storeData = {
                    user_id: auth_user.id,
                    store_name: store_name,
                };
                if (await models.Stores.findOne({
                    where: {
                        user_id: auth_user.id,
                        store_name: store_name,
                    }
                })) {
                    let updateData = {
                        store_name: store_name,
                    };
                    let storeUpdate = models.Stores.update(updateData, {
                        where: {
                            store_name: store_name,
                        },
                    });
                    if (storeUpdate) {
                        return res.json({
                            status: true,
                            message: "Shopify store Successfully Update",
                            page: "store_scopes",
                            store_name: store_name,
                        });
                    }
                } else {
                    let store_detail = models.Stores.create(storeData);
                    if (store_detail) {
                        return res.json({
                            status: true,
                            page: "store_scopes",
                            store_name: store_name,
                            store_detail: store_detail,
                            message: "Shopify store Successfully Create",
                            redirect_url: `${process.env.APP_URL}/${store_detail?.id}/dashboard`
                        });
                    }
                }
            } catch (error) {
                console.error("StoreConnect error -----------------", error);
                return res.json({
                    status: false,
                    page: "store_scopes",
                    message: "Something went wrong. Please try again.",
                });
            }
        }

        if (
            request_body?.access_token
            && request_body?.shopify_api_key
            && request_body?.shopify_secret_key
            && request_body?.store_domain
        ) {
            try {
                const existScopes = [];
                const incorrectScopes = [];
                var getApiOrAccessValid = {
                    json: true,
                    method: "GET",
                    uri: `https://${request_body?.shopify_api_key}:${request_body?.access_token}@${request_body?.store_domain}.myshopify.com/admin/api/2023-01/shop.json`,
                    json: true,
                };
                let shopifyValidation = await request(getApiOrAccessValid)
                    .then(async function (response) {
                        return response;
                    })
                    .catch(function (error) {
                        return error;
                    });
                if (!shopifyValidation?.error) {
                    console.log("shopifyValidation-------------shopifyValidation", shopifyValidation.shop.password_enabled);
                    var getApiScopes = {
                        json: true,
                        method: "GET",
                        uri: `https://${request_body?.store_domain}.myshopify.com/admin/oauth/access_scopes.json`,
                        headers: {
                            "X-Shopify-Access-Token": request_body?.access_token,
                            "Content-Type": "application/json",
                        },
                        json: true,
                    };
                    let shopifyScopes = await request(getApiScopes)
                        .then(async function (response) {
                            return response;
                        })
                        .catch(function (error) {
                            return error;
                        });
                    if (!shopifyScopes?.error) {
                        shopifyScopes.access_scopes.map((element) => {
                            existScopes.push(element.handle);
                        });
                        if (!existScopes.includes(SCOPES.Products.read_products)) {
                            incorrectScopes.push("read_products");
                        }
                        if (!existScopes.includes(SCOPES.Products.write_products)) {
                            incorrectScopes.push("write_products");
                        }
                        if (!existScopes.includes(SCOPES.Customers.read_customers)) {
                            incorrectScopes.push("read_customers");
                        }
                        if (!existScopes.includes(SCOPES.Customers.write_customers)) {
                            incorrectScopes.push("write_customers");
                        }
                        if (!existScopes.includes(SCOPES.Discounts.read_discounts)) {
                            incorrectScopes.push("read_discounts");
                        }
                        if (!existScopes.includes(SCOPES.Discounts.write_discounts)) {
                            incorrectScopes.push("write_discounts");
                        }
                        if (!existScopes.includes(SCOPES.Fulfillment_services.read_fulfillments)) {
                            incorrectScopes.push("read_fulfillments");
                        }
                        if (!existScopes.includes(SCOPES.GDPR_data_requests.read_gdpr_data_request)) {
                            incorrectScopes.push("read_gdpr_data_request");
                        }
                        if (!existScopes.includes(SCOPES.Gift_cards.read_gift_cards)) {
                            incorrectScopes.push("read_gift_cards");
                        }
                        if (!existScopes.includes(SCOPES.Inventory.read_inventory)) {
                            incorrectScopes.push("read_inventory");
                        }
                        if (!existScopes.includes(SCOPES.Inventory.write_inventory)) {
                            incorrectScopes.push("write_inventory");
                        }
                        if (!existScopes.includes(SCOPES.Order_editing.read_order_edits)) {
                            incorrectScopes.push("read_order_edits");
                        }
                        if (!existScopes.includes(SCOPES.Order_editing.write_order_edits)) {
                            incorrectScopes.push("write_order_edits");
                        }
                        if (!existScopes.includes(SCOPES.Orders.read_orders)) {
                            incorrectScopes.push("read_orders");
                        }
                        if (!existScopes.includes(SCOPES.Orders.write_orders)) {
                            incorrectScopes.push("write_orders");
                        }
                        if (!existScopes.includes(SCOPES.Price_rules.read_price_rules)) {
                            incorrectScopes.push("read_price_rules");
                        }
                        if (!existScopes.includes(SCOPES.Price_rules.write_price_rules)) {
                            incorrectScopes.push("write_price_rules");
                        }
                        if (!existScopes.includes(SCOPES.Products_listings.read_product_listings)) {
                            incorrectScopes.push("read_product_listings");
                        }
                        if (!existScopes.includes(SCOPES.Script_tags.read_script_tags)) {
                            incorrectScopes.push("read_script_tags");
                        }
                        if (!existScopes.includes(SCOPES.Script_tags.write_script_tags)) {
                            incorrectScopes.push("write_script_tags");
                        }
                        if (!existScopes.includes(SCOPES.Shipping.read_shipping)) {
                            incorrectScopes.push("read_shipping");
                        }
                        if (!existScopes.includes(SCOPES.Themes.read_themes)) {
                            incorrectScopes.push("read_themes");
                        }
                        if (!existScopes.includes(SCOPES.Themes.write_themes)) {
                            incorrectScopes.push("write_themes");
                        }
                    }

                    if (incorrectScopes.length > 0) {
                        return res.json({
                            status: true,
                            page: "incorrect_scopes",
                            store_name: request_body?.store_domain,
                            api_key: request_body?.shopify_api_key,
                            secret_key: request_body?.shopify_secret_key,
                            password: request_body?.access_token,
                            incorrectScopes: incorrectScopes,
                            message: "Something permission are set incorrectly",
                        });
                    } else {
                        if (shopifyValidation?.shop?.password_enabled) {
                            return res.json({
                                status: false,
                                message: "Before connect, please turn off password protection on your store",
                            });
                        } else {
                            let storeData = {
                                store_status: true,
                                store_token: request_body?.access_token,
                                store_domain: shopifyValidation?.shop?.domain,
                            };
                            await models.Stores.update(storeData, {
                                where: {
                                    store_name: request_body?.store_domain,
                                },
                            });

                            let storeId = await models.Stores.findOne({
                                where: {
                                    user_id: auth_user.id,
                                    store_name: request_body?.store_domain,
                                }
                            });
                            return res.json({
                                status: true,
                                page: "congrats_page",
                                store_name: request_body?.store_domain,
                                api_key: request_body?.shopify_api_key,
                                secret_key: request_body?.shopify_secret_key,
                                password: request_body?.access_token,
                                message: "Store Connected",
                                redirect_url: `${process.env.APP_URL}/${storeId.id}/dashboard`,
                            });
                        }
                    }
                } else {
                    console.log(shopifyValidation?.error);
                    return res.json({
                        status: false,
                        page: "",
                        message: "Invalid Api Key Or Access Token",
                    });
                }
            } catch (error) {
                console.log("accessTokenResponse error---------------accessTokenResponse error", error);
                return res.json({
                    status: false,
                    page: "store_details",
                    message: "Something went wrong. Please try again.",
                });
            }
        }
    }

    res.render("backend/ShopifyStore/store-connect", {
        right_sides: [],
        auth_user: auth_user,
    });
};

module.exports.CreateNewStore = async (req, res, next) => {
    const auth_user = req.auth_user;
    let store_id = Buffer.from(req.params.store_id, "base64").toString();

    res.render("backend/ShopifyStore/create", {
        right_sides: [],
        store_id: store_id,
        select_store: true,
        auth_user: auth_user,
    });
};

module.exports.ChangeDefaultStore = async (req, res, next) => {
    req.session.store_id = req.body.id;
    req.session.auth_store = req.body;
    req.session.save();

    res.cookie("store_id", req.body.id);

    return res.json({
        status: true,
        message: "created successfully",
        redirect_url: `${process.env.APP_URL}/${req.body.id}/dashboard`,
    });
};

module.exports.manage_store = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;

    let store_details = await models.Stores.findAll({
        where: {
            user_id: auth_user.id,
        },
    }).then((response) => {
        return response;
    });

    res.render("backend/ShopifyStore/manage_store", {
        right_sides: [],
        store_id: store_id,
        auth_user: auth_user,
        store_details: store_details,
    });
};

module.exports.Test = async (req, res, next) => {
    fetch("https://testappwithnodejs.myshopify.com/cart.json")
        .then(function (res) {
            console.log("event-----------", res);
        })
        .then(function (event) {
            console.log("event-----------", event);
        });
};

const PaymentMethods = require("../../helpers/");
const { PaypalPaymentCreate } = require("../../../libs/PaypalPaymentHelper");
const { StripeChargesCreate } = require("../../../libs/StripePaymentHelper");

module.exports.PaymentGateways = async (req, res, next) => {
    let request_body = req.body;

    // method == "paypal" &&
    // PostPaypal(req, res, function (error, paymentUrl) {
    // if (error) res.send({ success: false, error: error });
    // else res.send({ success: true, payment_url: paymentUrl });
    // });

    // method == "stripe" &&
    // PaymentMethods.Stripe(req, res, function (error, response) {
    // if (error) res.send({ success: false, error: error });
    // else res.send({ success: true, response: response });
    // });

    try {
        if (request_body?.method === "paypal") {
            await PaypalPaymentCreate(request_body, function (error, paymentUrl) {
                if (error) return res.json({ success: false, error: error });
                else
                    return res.json({
                        success: true,
                        payment_url: paymentUrl,
                        message: "Payment received successfully",
                    });
            });
        }

        if (request_body?.method === "stripe") {
            await StripeChargesCreate(request_body, function (error, response) {
                if (error) {
                    console.error("PaymentGateways stripe_response--------------", error);
                    return res.json({ error });
                } else {
                    console.error("PaymentGateways response--------------", response);
                    return res.json({ response });
                }
            });
        }

        if (request_body?.method == "cash_on_delivery") {
            res.json({
                status: true,
                message: "Payment received successfully",
            });
        }
    } catch (error) {
        // console.error("PaymentGateways error--------------", error);
        res.status(400).json({
            status: false,
            error: error,
            message: "Something went wrong. Please try again.",
        });
    }
};