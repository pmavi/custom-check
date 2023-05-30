const models = require("../models");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_8a0f1441a02c418de34865c2684786ccebcefec65abd3c21ebb98b00391f804b";

module.exports.StripeWebhook = async (req, res) => {
    const sig = req.header("stripe-signature");

    try {
        let event = req.body;
        switch (event.type) {
            // update planExpireDate of user when stripe renewed someone's subscription
            case "customer.subscription.trial_will_end":
                // send email to user about trial end;
                let trialEnd = event.data.object;
                // console.log("trial end for the user: ", trialEnd);

                res.status(200).send({ success: true });
                break;

            case "customer.subscription.updated":
                // send update to user that their plan has been updated
                let subscriptionUpdate = event.data.object;
                // console.log("subscription plan has been updated for the user: ", subscriptionUpdate.id);

                res.status(200).send({ success: true });
                break;

            case "customer.subscription.deleted":
                // send update to user that their plan has been updated
                let subscription_deleted = event.data.object;
                // console.log("StripeWebhook customer.subscription.deleted subscription_deleted-------------", subscription_deleted)

                res.status(200).send({ success: true });
                break;

            case "invoice.created":
                // send update to user about payment success for subscription
                let invoice_created = event.data.object;
                // console.log("StripeWebhook invoice.created invoice_created -------------", invoice_created)

                res.status(200).send({ success: true });
                break;

            case "invoice.paid":
                // send update to user about payment success for subscription
                var invoice = event.data.object;
                // console.log("StripeWebhook invoice.paid invoice -------------", invoice);

                ///////////////////////////// Get Subsciption Charge Details Start
                let stripe_card_last4, stripe_card_brand, stripe_card_id, stripe_customer_id, exp_month, exp_year;
                if (invoice?.charge) {
                    let charge_detail = await stripe.charges.retrieve(invoice.charge);
                    stripe_card_id = charge_detail?.payment_method;
                    stripe_customer_id = charge_detail?.customer;
                    if (charge_detail?.payment_method_details?.card) {
                        let card_detail = charge_detail?.payment_method_details?.card;

                        stripe_card_last4 = card_detail?.last4;
                        exp_month = card_detail?.exp_month;
                        exp_year = card_detail?.exp_year;
                        stripe_card_brand = card_detail?.brand
                    }
                }

                ///////////////////////////// Get Subsciption Charge Details End
                let user_subscription_billings = await models.UserSubscriptionBillings.findOne({
                    where: {
                        stripe_invoice_id: invoice.id,
                        stripe_subscription_id: invoice.subscription
                    },
                    order: [["id", "DESC"]],
                });
                let user_subscription_card_detail = await models.UserSubscriptionCardDetails.findOne({
                    where: {
                        stripe_card_id: stripe_card_id,
                    }
                });
                if (user_subscription_card_detail) {
                    user_subscription_card_detail.stripe_card_last4 = stripe_card_last4;
                    user_subscription_card_detail.exp_month = exp_month;
                    user_subscription_card_detail.exp_year = exp_year;
                    user_subscription_card_detail.stripe_card_brand = stripe_card_brand;
                    user_subscription_card_detail.stripe_customer_id = stripe_customer_id;
                    user_subscription_card_detail.save();
                }
                if (user_subscription_billings) {
                    user_subscription_billings.stripe_card_last4 = stripe_card_last4;
                    user_subscription_billings.stripe_card_brand = stripe_card_brand;
                    user_subscription_billings.stripe_invoice_number = invoice.number;
                    user_subscription_billings.stripe_invoice_pdf = invoice.invoice_pdf;
                    user_subscription_billings.save();
                }

                res.status(200).send({ success: true });
                break;

            default:
                res.status(200).send({ success: true });
        }
    } catch (error) {
        res.send({ error, success: false, message: "stripe webhook error" });
    }
};