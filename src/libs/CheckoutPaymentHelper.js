const { Checkout } = require('checkout-sdk-node');

module.exports.CheckCheckoutKey = async (request_parameters) => {
    const { user_id, publishable_key, secret } = request_parameters;

    return new Promise((resolve, reject) => {
        try {
            const cko = new Checkout();
            cko.access.request({
                grant_type: 'client_credentials',
                client_id: publishable_key,
                client_secret: secret,
                scope: 'gateway',
            }).then((result) => {

                resolve(result)
            }).catch((err) => {

                reject(err)
            })

        } catch (err) {
            reject(err.name)

        }
    })
}