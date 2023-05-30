const { SubscriptionPackage, Stores } = require("../models");

module.exports.dashboard = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req.auth_store;

    let store_details = await Stores.findAll({
        where: {
            user_id: auth_user.id,
        },
    });
    if (store_details) {
        req.session.store_details = store_details;
    }
    if(store_id){
        let store_detail = await Stores.findOne({
            where: {
                id: store_id,
            },
        });
        if(store_detail){
            req.session.auth_store = store_detail;
        }
    }
    req.session.store_id = store_id;
    req.session.save();
    res.cookie('store_id', store_id);

    return res.render("backend/Dashboard/index", {
        store_id: store_id,
        auth_user: auth_user,
        auth_store: auth_store,
        active_menu:"dashboard",
    });
};