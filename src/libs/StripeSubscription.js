
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


module.exports = {
  PUBLISH_KEY : process.env.STRIPE_PUBLISH_KEY,
 SECRET_KEY :process.env.STRIPE_SECRET_KEY,
 stripeSession
}
 