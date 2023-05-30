const models = require("../models");

module.exports.OrderCreate = async (req, res, next) => {
  try {
    console.log(JSON.parse(req.body.data), "req data");
    const {
      store_id,
      email,
      first_name,
      last_name,
      address,
      city,
      state,
      country,
      zipCode,
      payment_method,
    } = JSON.parse(req.body.data);

    const Customer = await models.Customers.findOne({
      where: { email: email },
    });

    if (Customer) {
      let order_details = {
        customer_id: Customer?.id,
        first_name: first_name,
        last_name: last_name,
        email: email,
        address: address,
        city: city,
        state: state,
        zipcode: zipCode,
        country: country,
      };

      await models.Orders.create(order_details);
      return res.json({ status: true });
    } else {

      let customer_details = {
        store_id: store_id,
        email: email,
        first_name: first_name,
        last_name: last_name,
      };

      const create_customer = await models.Customers.create(customer_details);

      if (create_customer) {
        let order_details = {
          customer_id: create_customer?.id,
          first_name: first_name,
          last_name: last_name,
          email: email,
          address: address,
          city: city,
          state: state,
          zipcode: zipCode,
          country: country,
        };

        await models.Orders.create(order_details);
        return res.json({ status: true });
      }
    }
  } catch (error) {
    return res.json({
      error: error,
      status: false,
      message: "Something went wrong. Please try again.",
    });
  }
};
