const { BuyLinks, Stores } = require("../models");


module.exports.buy_link = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req.auth_store;

    if (req.method === "POST") {
        let request_body = req.body;
        request_body.user_id = auth_user?.id;
        console.log("------------------requestbody", request_body)
        try {
            if (!request_body.product_ids) {
                return res.json({
                    status: false,
                    message: 'Please add a product!'
                });
            }
            let buy_link = await  BuyLinks.create(request_body);
            if (buy_link) {
                return res.json({
                    status: true,
                    message: 'Link Added'
                });
            }
            else {
                return res.json({
                    status: false,
                    message: 'Unable to add data'
                });
            }

        }
        catch (error) {
            console.error(" error------------", error);
            return res.json({
                status: false,
                message: 'Something went wrong.Please check your details!'
            });
        }
    }

    res.render("backend/BuyLink/buy_link", {
        store_id: store_id,
        auth_user: auth_user,
        auth_store: auth_store,
        active_menu: "buy-link",
    });
};