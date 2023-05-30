const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

module.exports.Stripe = async (req, res, callback) => {
  const { card_number, expiry_month, expiry_year, cvv, currency_name, price } =
    req.body;

  try {
    const token = await stripe.tokens.create({
      card: {
        number: card_number,
        exp_month: expiry_month,
        exp_year: expiry_year,
        cvc: cvv,
      },
    });

    const charge = await stripe.charges.create({
      currency: currency_name,
      amount: price * 100,
      source: token.id,
      // description: 'My First Test Charge',
    });
    const myPromise = new Promise((resolve, reject) => {
      resolve(charge);
    });

    myPromise.then((result) => {

      var response = {
        message: "Charge Done Successfully!",
        charge: result,
        status: 200,
      };
      callback(null, response);
    });
  } catch (error) {
    console.log("MakePayment error---------", error);
    callback(error, null);
  }
};
