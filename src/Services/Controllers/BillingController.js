const Sq = require("sequelize");
const moment = require("moment");

const {
	Users, Stores,
	SubscriptionPackage, UserSubscriptions,
	UserSubscriptionBillingDetails, UserSubscriptionBillings, UserSubscriptionCardDetails,

} = require("../models");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports.billing_details = async (req, res, next) => {
	const { store_id } = req.params;
	const auth_user = req.auth_user;
	const auth_store = req?.auth_store;

	// Post Action
	if (req.method === "POST") {
		try {
			let request_body = req.body;
			let store_id = request_body.store_id;
			let selected_card = request_body.card_id;


			let package_detail = await SubscriptionPackage.findOne({
				where: {
					id: request_body.subscription_package_id,
				},
			});

			/*** Check Customer exist in Stripe or not ***/
			let stripe_customer_id;
			if (auth_user?.stripe_customer_id) {
				stripe_customer_id = auth_user?.stripe_customer_id;
			} else {
				let stripe_customers = {
					email: auth_user.email,
					name: `${auth_user.first_name} ${auth_user.last_name}`,
					address: { country: "IN" },
				};
				await stripe.customers.create(stripe_customers).then(async function (customer) {
					stripe_customer_id = customer.id;
				}).catch((error) => {
					console.error("billing_details stripe.customers.create error---------", error);
					res.json({
						error: error,
						status: false,
						message: "Something went wrong. Please try again",
					});
				});
				await Users.update(
					{
						stripe_customer_id: stripe_customer_id,
					},
					{
						where: {
							email: auth_user.email,
						},
					}
				);
			}

			/*** Generate New Card Agains customer ***/
			let stripe_card_id;
			if (selected_card && selected_card != "new_card") {
				stripe_card_id = selected_card;
				await stripe.customers.update(stripe_customer_id, {
					invoice_settings: {
						default_payment_method: stripe_card_id,
					},
				}).then(async function (customer) {
					console.log("billing_details customer*******---------", customer);
				});
			} else
				if (request_body.card_number && request_body.expiry_date && request_body.card_cvv) {

					let expiry_date = request_body?.expiry_date.split("/")
					let card_detail = {
						card: {
							number: request_body.card_number,
							exp_month: expiry_date[0],
							exp_year: expiry_date[1],
							cvc: request_body.card_cvv,
							name: `${auth_user.first_name} ${auth_user.last_name}`,
						},
					};
					let card4digit = request_body?.card_number.substring(request_body?.card_number.length - 4);
					let dateChage = moment(expiry_date[1], "YY")
					let yearNew = dateChage.format("YYYY")
					// check if card exists in DB 
					let user_subscription_card = await UserSubscriptionCardDetails.findOne({
						where: {
							user_id: auth_user?.id,
							stripe_card_last4: card4digit,
							exp_month: card_detail?.card?.exp_month,
							exp_year: yearNew,
						}
					});
					if (user_subscription_card && user_subscription_card?.stripe_card_id) {
						stripe_card_id = user_subscription_card?.stripe_card_id;
					} else {

						await stripe.tokens.create(card_detail).then(async (token) => {
							let stripe_token = token.id;

							await stripe.customers.createSource(stripe_customer_id, {
								source: stripe_token
							}).then(async function (secret_key) {
								stripe_card_id = secret_key.id;
							}).catch((error) => {
								res.json({
									error: error,
									status: false,
									message: "Something went wrong. Please try again",
								});
							});
						});
					}
					// check if card exists in DB 
					await stripe.customers.update(stripe_customer_id, {
						invoice_settings: {
							default_payment_method: stripe_card_id,
						},
					}).then(async function (customer) {
						console.log("billing_details customer---------", customer);
					});
				}

			/*** Genrate Subscription agains customer ***/
			let stripe_subscription = await stripe.subscriptions.create({
				customer: stripe_customer_id,
				items: [
					{
						price: package_detail.stript_object_id
					}
				],
			});

			let user_subscription_card_detail = await UserSubscriptionCardDetails.findOne({
				where: {
					user_id: auth_user?.id,
					stripe_card_id: stripe_card_id,
				}
			});
			if (user_subscription_card_detail) {
				user_subscription_card_detail.is_default = true;
				user_subscription_card_detail.save();
			} else {
				user_subscription_card_detail = await UserSubscriptionCardDetails.create({
					user_id: auth_user?.id,
					stripe_card_id: stripe_card_id,
					is_default: true,
				});
			}
			/*** Create UserSubscriptions */
			let start_date = moment().format("YYYY-MM-DD");
			let end_date = moment(start_date).add(1, package_detail.billing_cycle).format("YYYY-MM-DD");
			let user_subscription = await UserSubscriptions.findOne({
				where: {
					user_id: auth_user?.id,
					store_id: store_id,
				}
			});
			let user_subscription_billings = await UserSubscriptionBillings.findOne({
				where: {
					user_id: auth_user?.id,
					store_id: store_id,
				}
			});
			let subscription_details = {
				user_id: auth_user?.id,
				store_id: store_id,
				subscription_package_id: package_detail?.id,
				billing_cycle: package_detail?.billing_cycle,
				start_date: start_date,
				end_date: end_date,
			}
			if (!user_subscription) {
				user_subscription = await UserSubscriptions.create(subscription_details);
			}

			/*** Create User Subscriptions Billing Details*/
			let User_subscription_billing_details = {
				user_id: auth_user?.id,
				store_id: store_id,
				user_subscription_id: user_subscription?.id,
				subscription_package_id: package_detail?.id,
				billing_company: request_body.billing_company,
				billing_first_name: request_body.billing_first_name,
				billing_last_name: request_body.billing_last_name,
				billing_address: request_body.billing_address,
				billing_city: request_body.billing_city,
				billing_zip: request_body.billing_zip,
				billing_state: request_body.billing_state,
				billing_country_code: request_body.billing_country_code,
			}
			await UserSubscriptionBillingDetails.create(User_subscription_billing_details);

			/*** Create User Subscription Billings*/
			let user_subscription_billings_create = {
				user_id: auth_user?.id,
				store_id: store_id,
				user_subscription_id: user_subscription?.id,
				subscription_package_id: package_detail?.id,
				billing_cycle: package_detail?.billing_cycle,
				price: package_detail?.price,
				start_date: start_date,
				end_date: end_date,
				status: "Active",

				card_detail_id: user_subscription_card_detail?.id,
				stripe_subscription_id: stripe_subscription?.id,
				stripe_customer_id: stripe_subscription?.customer,
				stripe_invoice_id: stripe_subscription?.latest_invoice,
			}
			if (user_subscription_billings) {
				user_subscription_billings_create.status = "Inactive";
			}
			await UserSubscriptionBillings.create(user_subscription_billings_create);


			// Update Billing Details in Store Table
			await Stores.update(
				{
					user_subscription_id: user_subscription?.id
				},
				{
					where: {
						id: store_id,
					},
				}
			);

			return res.json({
				status: true,
				message: "Billing create successfully",
				redirect_url: `${process.env.APP_URL}/${store_id}/dashboard`,
			});
		} catch (error) {
			console.error("billing_details error -----------------", error);
			return res.json({
				error: error,
				status: false,
				message: "Something went wrong. Please try again.",
			});
		}
	}

	// Get Action
	let subscription_packages;
	await SubscriptionPackage.findAll({}).then(function (response) {
		subscription_packages = response
	}).catch((error) => {
		console.error("billing_details error-----------", error);
		return res.json({
			error: error,
			status: false,
			message: "Something went wrong. Please try again",
		});
	});

	let user_subscription_cards = await UserSubscriptionCardDetails.findAll({
		where: {
			user_id: auth_user?.id,
		}
	});

	let billing_details = await UserSubscriptionBillingDetails.findOne({
		where: {
			user_id: auth_user?.id,
			store_id: store_id,
		},
		order: [["id", "DESC"]],
	});

	let user_billings_invoices = await UserSubscriptionBillings.findAll({
		where: {
			user_id: auth_user?.id,
			store_id: store_id,
		}
	});

	res.render("backend/Billing/billing_details", {
		store_id: store_id,
		auth_user: auth_user,
		auth_store: auth_store,
		active_menu: "billing-details",

		user_subscription_cards: user_subscription_cards,
		billing_details: billing_details,
		user_billings_invoices: user_billings_invoices,
		subscription_packages: subscription_packages
	});
};