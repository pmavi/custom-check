const request = require("request");
const paypal = require("paypal-rest-sdk");

module.exports.CheckPayPalKey = async (request_parameters) => {
    const { user_id, publishable_key, secret } = request_parameters;
	
    return new Promise((resolve, reject) => {
        try {
            request.post(
                {
                    uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
                    headers: {
                        Accept: "application/json",
                        "Accept-Language": "en_US",
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    auth: {
                        user: publishable_key,
                        pass: secret,
                    },
                    form: {
                        grant_type: "client_credentials",
                    },
                },
                function (error, response, body) {
                    const data = JSON.parse(body);
                    if (data.error == "invalid_client") {
                        reject(data.error_description);
                    } else {
                        resolve(data.access_token);
                    }
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};

module.exports.PaypalPaymentCreate = async (request_body, callback) => {
  
paypal.configure({
  mode: process.env.PAYPAL_MODE, //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET_ID,
});
  
  var items = [];
  var currency;
  var subTotal = 0;

  var productDataArray = JSON.parse(request_body.data);
  console.log("productDataArray-------productDataArray", productDataArray)
    productDataArray.forEach((element) => {
      const item_body = {
        name: element.name,
        price: element.price,
        currency: "USD",
        quantity: element.quantity,
      };

      items.push(item_body);

      subTotal += parseFloat(element.quantity * element.price);
      currency = element.currency;
    });
  
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