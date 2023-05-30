const paypal = require("paypal-rest-sdk");
const open = require('open');
const {Stores } = require("../../models");

paypal.configure({
  mode: process.env.PAYPAL_MODE, //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_ID,
});

module.exports.getSuccessPaypal = async (req, res, next) => {
  var paymentId = req.query.paymentId;
  var payerId = { payer_id: req.query.PayerID };
  paypal.payment.execute(paymentId, payerId, async function (error, payment) {
    if (error) {
      console.error(JSON.stringify(error));
      return next(error);
    } else {
      if (payment.state == "approved") {
        const storeData = await Stores.findOne({
            where: {
                id: req.cookies.store_id,
            },
        }).then((response) => {
            res.redirect(`https://${response.store_domain}/pages/thanku-page`);
        });
      } else {
        console.log("payment not successful");
      }
    }
  });
};

module.exports.cancelPaypal = async (req, res, next) => {
  res.send("Cancelled");
};