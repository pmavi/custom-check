const Sq = require("sequelize");
const moment = require("moment");

const { UserSubscriptionBillings, SubscriptionPackage, Users } = require("../models");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports.invoice_listing = async (req, res, next) => {
	const { store_id } = req.params;
	const auth_user = req.auth_user;
	const auth_store = req?.auth_store;

	// Get Action
	let user_billings_invoices = await UserSubscriptionBillings.findAll({
		where: {
			user_id: auth_user?.id,
			store_id: store_id,
		}
	});

	res.render("backend/Billing/invoice_details", {
		store_id: store_id,
		auth_user: auth_user,
		auth_store: auth_store,
		active_menu: "billing-details",

		moment: moment,
		user_billings_invoices: user_billings_invoices,
	});
};
module.exports.invoice_details = async (req, res, next) => {
	const auth_user = req.auth_user;
	const auth_store = req?.auth_store;
	const { store_id, invoice_id } = req.params;

	// Get Action
	let user_billings_invoices = await UserSubscriptionBillings.findOne({
		where: {
			id: invoice_id,
		}
	});

	let subscription_package;
	let user_detail;
	if (user_billings_invoices) {
		subscription_package = await SubscriptionPackage.findOne({
			where: {
				id: user_billings_invoices?.subscription_package_id,
			}
		});
		user_detail = await Users.findOne({
			where: {
				id: user_billings_invoices?.user_id,
			}
		});
	}

	res.render("backend/Billing/invoice", {
		store_id: store_id,
		auth_user: auth_user,
		auth_store: auth_store,
		active_menu: "billing-details",

		moment: moment,
		user_billings_invoices: user_billings_invoices,
		subscription_package: subscription_package,
		user_detail: user_detail,
	});
};