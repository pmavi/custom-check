const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const { Users, UserSubscriptions, Stores } = require("../Services/models");

module.exports.frontend_authorize = async (req, res, next) => {
    let server_session = req?.session;

    if (server_session?.token && server_session?.user && server_session?.store_id) {
        return res.redirect(`/${server_session?.store_id}/dashboard`);
    }

    next();
};

module.exports.wed_authorize = async (req, res, next) => {
    let auth_token = req?.session?.token;
    try {
        if (!auth_token) {
            return res.redirect("/");
        }

        let session_user = req?.session?.user;
        auth_token = jwt.verify(auth_token, process.env.JWT_SECRET_TOKEN);

        // Check Auth user
        const auth_user = await Users.findOne({
            where: {
                id: auth_token.user_id,
            },
        });
        if (session_user?.id !== auth_user?.id) {
            return res.redirect("/");
        }

        req.auth_user = auth_user;
    } catch (error) {
        console.error("wed_authorize error -----------------", error);
        return res.json({
            status: false,
            message: "Something went wrong. Please try again.",
        });
    }

    next();
};

module.exports.checksubscription = async (req, res, next) => {
    let { store_id } = req.params;
    const auth_user = req.auth_user;
    let server_session = req?.session;
    try {

        // Check Auth Store
        store_id = store_id ? store_id : server_session?.store_id;

        let user_store_where = { user_id: auth_user.id };
        if (store_id) {
            user_store_where = { ...user_store_where, id: store_id };
			console.log("middleware checksubscription user_store_where------------", user_store_where);
            let auth_store = await Stores.findOne({ where: user_store_where });

            // check status, billing
            if (auth_store) {

                let store_details_auth = await Stores.findAll({
                    where: {
                        user_id: auth_user.id,
                    },
                });
                if (store_details_auth) {
                    req.session.store_details = store_details_auth;
                }

                req.auth_store = auth_store;
                req.session.auth_store = auth_store;
				
            } else {
                if (req?.route?.path !== "/store-connect" && req?.route?.path !== "/store-connect/") {
                    return res.redirect("/store-connect");
                }
            }
        }

    } catch (error) {
        console.error("middleware checksubscription error -----------------", error);
        return res.json({
            status: false,
            message: "Something went wrong. Please try again.",
        });
    }

    next();
};