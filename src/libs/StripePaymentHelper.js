const { callbackPromise } = require("nodemailer/lib/shared");


module.exports.CheckStripeKey = async (request_parameters) => {
	const stripe = require("stripe");
	
    const { user_id, publishable_key, secret } = request_parameters;

    return new Promise((resolve, reject) => {
        try {
            if (publishable_key && secret) {
                let key = publishable_key.startsWith("pk_live_") || publishable_key.startsWith("pk_test_");

                if (key === false) {
                    reject("Invalid Publish Key!");
                }

                if ((publishable_key.startsWith("pk_live_") === true && secret.startsWith("sk_live_") === false) || (!publishable_key.startsWith("pk_live_") === false && secret.startsWith("sk_live_") === true)) {
                    reject("One of key is invalid either publish or secret!");
                }

                let data = stripe(secret);
                data.identity.verificationSessions
                    .create({
                        type: "document",
                        metadata: {
                            user_id: user_id,
                        },
                    })
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        if (error.type === "StripeAuthenticationError") {
                            reject(error.raw.message);
                        }
                        if (error === "StripeInvalidRequestError") {
                            reject(error.raw.message);
                        }
                    });
            }
        } catch (error) {
            reject(error);
        }
    });
};



module.exports.StripeChargesCreate = async (request_body, callback) => {
    return new Promise(async (resolve, reject) => {
        try {

            const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
                apiVersion: "2020-08-27",
            });

            /*** Check Customer exist in Stripe or not ***/
            let stripe_customer_id;
            let stripe_customers = {
                email: request_body.email,
                name: `${request_body.first_name} ${request_body.last_name}`
            };
            await stripe.customers.create(stripe_customers).then(async function (customer) {
                stripe_customer_id = customer.id;
            });

            // Add Card in the Stripe
            if (request_body.card_number && request_body.expiry_month && request_body.expiry_year && request_body.cvv) {
                let card_detail = {
                    card: {
                        number: request_body.card_number,
                        exp_month: request_body.expiry_month,
                        exp_year: request_body.expiry_year,
                        cvc: request_body.cvv,
                    },
                };

                // Create Card in the stripe
                let stripe_card_id;
                let stripe_token;
                await stripe.tokens.create(card_detail).then(async (token) => {
                    stripe_token = token.id;
                    stripe_carddetail = token.card.last4;
                });

                // Assign Card to the customer
                await stripe.customers.createSource(stripe_customer_id, { source: stripe_token }).then(async function (secret_key) {
                    stripe_card_id = secret_key.id;
                });

                // Make Card as default card
                await stripe.customers.update(stripe_customer_id, {
                    invoice_settings: {
                        default_payment_method: stripe_card_id
                    }
                }).then(async function (customer) {
                    console.log("StripeChargesCreate customer---------", customer);
                });
            }

            const stripecharge_response = await stripe.charges.create({
                customer: stripe_customer_id,
                amount: request_body?.price * 100,
                currency: request_body?.currency_name
            });
            var response = {
                status: true,
                data: stripecharge_response,
                message: "Payment received successfully",
            }
            callback(null,response)
        } catch (error) {
            // console.error("StripeChargesCreate error -----------------", error);
            var response = {
                error: error,
                status: false,
                message: "Something went wrong. Please try again.",
            }
            callback(response,null)
            
        }
    });
};