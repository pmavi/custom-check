const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});
module.exports.ConnectCreate = async (req, res) => {
    let request_body = req.body;

    console.log("hello");
    try {
        let stripe_card_token = await stripe.tokens.create({
            bank_account: {
                country: request_body?.country,
                currency: 'usd',
                account_holder_name: request_body?.first_name + ' ' + request_body?.last_name,
                account_holder_type: request_body?.account_type,
                routing_number: request_body?.routing_number,
                account_number: request_body?.account_number,
            },
        });

        const stripe_account = await stripe.accounts.create({
            type: 'custom', // standard, express, custom
            country: request_body?.country,
            email: request_body?.email,
            capabilities: {
                transfers: {
                    requested: true
                },
                card_payments: {
                    requested: true
                },
            },
            business_type: request_body?.account_type,
            business_profile: {
                url: request_body?.business_url,
                mcc: request_body?.business_mcc,
            },
            tos_acceptance: {
                ip: '103.164.67.66',
                date: Math.floor(Date.now() / 1000),
            },
            external_account: stripe_card_token.id,
            individual: {
                ssn_last_4: request_body?.ssn_last_4,
                email: request_body?.email,
                first_name: request_body?.first_name,
                last_name: request_body?.last_name,
                phone: request_body?.phone_number,
                dob: {
                    day: request_body?.birth_day,
                    month: request_body?.birth_month,
                    year: request_body?.birth_year
                },
                address: {
                    line1: request_body?.address_1,
                    line2: request_body?.address_2,
                    state: request_body?.state, // PB, AL
                    city: request_body?.city,
                    postal_code: request_body?.postal_code,
                    country: request_body?.country // IN, US
                },
            },
            settings: {
                payouts: {
                    schedule: {
                        interval: "manual"
                    }
                }
            }
        });

        return ReS(res, { message: "stripe connect created successfully!", stripe_account }, 200);
    } catch (error) {
        console.log("ConnectCreate error---------", error);
        return ReE(res, error.message, 400);
    }
};

/*** Collect Payment from Customer ***/
module.exports.MakePayment = async (req, res) => {
    let request_body = req.body;
    // console.log(request_body);

    try {

        const stripe_charge = await stripe.paymentIntents.create({
            currency: request_body.currency_name,
            amount: request_body.price * 100,
            customer: "cus_N0kUDiXzwETkRd",
            confirmation_method: 'manual',
            confirm: true,
            capture_method: 'manual',
        });

        const stripe_response = {
            charge_id: stripe_charge?.id,
            customer_id: stripe_charge?.customer,
            card_details: stripe_charge?.payment_method_details,
        };


        return ReS(res, { message: "Payment Done Successfully!", stripe_response }, 200);
    } catch (error) {
        console.log("MakePayment error---------", error);
        return ReE(res, error.message, 400);
    }
};
