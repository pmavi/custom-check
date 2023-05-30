const { Stores } = require("../models");
const request = require("request-promise");

module.exports.upsell = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req.auth_store;

    res.render("backend/Upsell/upsell.pug", {
        store_id: store_id,
        auth_user: auth_user,
        auth_store: auth_store,
        active_menu: "upsell",
    });
};

module.exports.add_upsell = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    const auth_store = req.auth_store;
    var productsData;
  // Check user subscription
  const storeData = await Stores.findOne({
    where: { id: store_id },
  });

  if (storeData) {
    var options = {
      method: "GET",
      url: `https://${storeData.store_domain}/admin/api/2022-10/products.json?fields=id,title,image&limit=250`,
      headers: {
        "X-Shopify-Access-Token": storeData.store_token,
        "Content-Type": "application/json",
      },
    };
    await request(options, function (error, response) {
      if (error) throw new Error(error);
      productsData = response.body;
    });
  }

  return res.render("backend/Upsell/add_upsell.pug", {
        store_id: store_id,
        auth_user: auth_user,
        auth_store: auth_store,
        active_menu: "upsell",
        products: productsData,
  });
};