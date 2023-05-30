const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: process.env.PAYPAL_MODE, //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_ID,
});

module.exports.PostPaypal = async (req, res, callback) => {
  var request_body = req.body;
  // console.log(request_body, "request_body--------------")
  var items = [];
  var currency;
  var subTotal = 0;
  var productDataArray = JSON.parse(request_body.data);
  if (request_body?.single) {
    items.push(productDataArray);
    subTotal = parseFloat(productDataArray.quantity * productDataArray.price);
    currency = productDataArray.currency;
  } else {
    productDataArray.forEach((element) => {
      const item_body = {
        name: element.name,
        sku: element.sku,
        price: element.price,
        currency: "USD",
        quantity: element.quantity,
      };

      items.push(item_body);
      subTotal += parseFloat(element.quantity * element.price);
      currency = element.currency;
    });
  }
  console.log(subTotal, "subTotal")
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: process.env.PAYPAL_SUCCESS_URL,
      cancel_url: process.env.PAYPAL_CANCEL_URL,
    },
    transactions: [
      {
        item_list: {
          items: items,
        },
        amount: {
          currency: "USD",
          total: subTotal,
        },
        description: "Purcahsed from the Store",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      callback(error, null);
      throw error;
    } else {
      console.log(payment.links);

      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          callback(null, payment.links[i].href);
        }
      }
    }
  });
  
};
