const models = require("../models");

const { CustomizeAboutSections, CustomizeCheckout, Stores, ShippingRates, PaymentMethods, Translations } = require("../models");

module.exports.create_checkout = async (req, res, next) => {
    const { store_id } = req.params;
    console.log('create_checkout store_id----------', store_id);

    try {
        let store_detail = await models.Checkouts.create(
            {
                shop_id: store_id,
            },
        ).then((response) => {
            return response;
        });

        return res.json({
            status: true,
            message: "Checkout create successfully",
            store_detail: store_detail,
        });
    } catch (error) {
        console.log('create_checkout error----------', error);
        return res.json({
            status: false,
            message: 'Something went wrong.Please check your details!'
        });
    }
};

module.exports.get_checkout = async (req, res, next) => {
    const { checkout_id, store_id } = req.params;
    console.log('get_checkout checkout_id----------', checkout_id);
    console.log('get_checkout store_id----------', store_id);

    try {

        let checkout_detail = await models.Checkouts.findOne({
            where: {
                id: checkout_id,
                shop_id: store_id
            }
        }).then((response) => {
            return response;
        });

        if (checkout_detail) {
            return res.json({
                status: true,
                message: "Checkout find successfully",
                checkout_detail: checkout_detail
            });
        } else {
            return res.json({
                status: false,
                message: "Checkout not found",
            });
        }

    } catch (error) {
        console.log('get_checkout error----------', error);
        return res.json({
            status: false,
            message: 'Something went wrong.Please check your details!'
        });
    }
};

module.exports.update_checkout = async (req, res, next) => {
    const { checkout_id, store_id, line_items } = req.params;
    let request_body = req.body;

    try {
        let line_items = request_body?.line_items;

        let checkout_detail = await models.Checkouts.findOne({
            where: {
                id: checkout_id,
                shop_id: store_id
            }
        }).then((response) => {
            return response;
        });

        if (checkout_detail) {

            let cart_detail = await models.Cart.findOne({
                where: {
                    checkout_id: checkout_detail?.id,
                }
            }).then((response) => {
                return response;
            });

            if (cart_detail) {
                line_items.forEach(async (line_item) => {

                    let cart_product = await models.Cart.findOne({
                        where: {
                            checkout_id: checkout_detail?.id,
                            product_id: line_item.product_id?.toString(),
                            variant_id: line_item.variant_id?.toString(),
                        }
                    });

                    if (cart_product) {
                        if (
                            cart_product?.price !== line_item.price
                            || cart_product?.quantity !== line_item.quantity
                        ) {
                            await models.Cart.update({
                                price: line_item.price,
                                quantity: line_item.quantity,
                            }, {
                                where: {
                                    id: cart_product?.id,
                                },
                            });
                        }
                    } else {
                        let cart_items = {
                            checkout_id: checkout_detail?.id,
                            product_id: line_item.product_id,
                            variant_id: line_item.variant_id,
                            price: line_item.price,
                            quantity: line_item.quantity,
                            image: line_item.image,
                            title: line_item.title,
                        }
                        await models.Cart.create(cart_items)
                    }
                });
            } else {
                let cart_items = [];
                for (let line_item of line_items) {
                    cart_items.push({
                        checkout_id: checkout_detail?.id,
                        product_id: line_item.product_id,
                        variant_id: line_item.variant_id,
                        price: line_item.price,
                        quantity: line_item.quantity,
                        image: line_item.image,
                        title: line_item.title,
                    })
                }
                await models.Cart.bulkCreate(cart_items);
            }
            return res.json({
                status: true,
                message: "Checkout update successfully",
            });
        } else {
            return res.json({
                status: false,
                message: "Checkout not found",
            });
        }
    } catch (error) {
        console.log('get_checkout error----------', error);
        return res.json({
            status: false,
            message: 'Something went wrong.Please check your details!'
        });
    }
};

module.exports.frontend_checkout = async (req, res, next) => {
    const { checkout_id, store_id } = req.params;
    console.log('frontend_checkout checkout_id----------', checkout_id);
    console.log('frontend_checkout store_id----------', store_id);

    // Get Store Customize Checkout
    let customize_checkout = await CustomizeCheckout.findOne({
        where: { store_id: store_id, },
        include: [
            {
                model: CustomizeAboutSections,
            },
        ],
    }).then((response) => {
        return response;
    });

    // Get Store ShippingRates Details
    let shipping_options = await ShippingRates.findAll({
        where: { store_id: store_id },
    }).then((response) => {
        return response;
    });

    // Get Store PaymentMethods Details
    let payment_methods = await PaymentMethods.findAll({
        where: { store_id: store_id }
    }).then((response) => {
        return response;
    });

    // Get Store Translations Details
    let language_translation = await Translations.findOne({
        where: {
            store_id: store_id
        },
    }).then((response) => {
        return response;
    });

    // Get Checkout and cart details
    let checkout_detail = await models.Checkouts.findOne({
        where: {
            id: checkout_id,
            shop_id: store_id
        },
        include: [
            {
                model: models.Cart,
            },
        ],
    }).then((response) => {
        return response;
    });

    let total_price = 0;
    let product_details = []
    if (checkout_detail) {
        for (cart_detail of checkout_detail?.carts) {
            product_details.push({
                title: cart_detail.title,
                image: cart_detail.image,
                quantity: cart_detail.quantity,
                price: cart_detail.price,
            });

            total_price = parseFloat(total_price) + parseFloat(cart_detail.price);
        }
    }

    res.render("shopify/preview_checkout", {
        payment_methods: payment_methods,
        shipping_options: shipping_options,
        customize_checkout: customize_checkout,
        language_translation: language_translation,

        total_price: total_price,
        checkout_detail: checkout_detail,
        product_details: product_details
    });
};

module.exports.checkout_thanks = async (req, res, next) => {
    const { checkout_id, store_id } = req.params;
    res.render("shopify/thank-you", {});
};


module.exports.checkoutDomain = async (req, res, next) => {
    console.log("hello checkout domain")
    return "true"
}

module.exports.checkout_redirect = async (req, res, next) => {
    console.log("hello checkout domain")
    res.render("shopify/preview_checkout");
}