module.exports.taxes_index = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req.auth_store;

    res.render("backend/Taxes/taxes", {
        store_id: store_id,
        auth_user: auth_user,
        auth_user: auth_user,
        auth_store: auth_store
    });
};
module.exports.add_taxes = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req.auth_store;

    res.render("backend/Taxes/add_taxes", {
        store_id: store_id,
        auth_user: auth_user,
        auth_user: auth_user,
        auth_store: auth_store
    });
};