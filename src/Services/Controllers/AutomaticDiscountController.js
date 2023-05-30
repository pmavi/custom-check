"use strict";
const { AutomaticDiscounts, Stores } = require("../models");

module.exports.discount_listing = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req?.auth_user;

    console.log("----authuser",auth_user);
    let discounts = await AutomaticDiscounts.findAll({
        where: {
            store_id: store_id,
            user_id: auth_user.id,
        },
    }).then((response) => {
        return response;
    });
    console.log("-----------discounts:",discounts);
    return res.render("backend/AutomaticDiscount/discount_listing", {
        store_id:store_id,
        discounts:discounts
    })
};

module.exports.add_discount = async (req, res, next) => {
    const { store_id } = req.params;
    const auth_user = req.auth_user;
    console.log("---store id",store_id)
    if(req.method === "POST"){
        try {
            let request_body = req.body;
           // request_body.store_id = store_id;
            request_body.user_id = auth_user?.id;
            if(!request_body.discount_title){
                return res.json({
                    status: false,
                    message: 'Missing discount title',
                });
            }
            console.log("--------------ids", request_body)
            if(request_body.discount_type_buy){
                request_body.discount_type = 'Buy X Get Y';
            }
            if(request_body.discount_type_percentage){
                request_body.discount_type = 'Percentage';
            }
            if(request_body.discount_type_fixed){
                request_body.discount_type = 'Fixed Amount';
            }
            if(request_body.discount_type_freeshipping){
                request_body.discount_type = 'Free Shipping';
            }
            if(request_body.cart_mini_quantity){
                request_body.cart_minimum_quantity = request_body.cart_mini_quantity;
            }
            if(request_body.cart_mini_quantity_bool  ){
                request_body.cart_minimum_quantity_bool = request_body.cart_mini_quantity_bool;
            }
            if(request_body.cart_mini_amount_bool){
                request_body.cart_minimum_amount_bool = request_body.cart_mini_amount_bool;
            }
            if(request_body.cart_amt_quantity){
                request_body.cart_minimum_amount = request_body.cart_amt_quantity;
            }
           
             request_body.cart_minimum_quantity = request_body?.cart_minimum_quantity || 0;
             request_body.cart_minimum_amount = request_body?.cart_minimum_amount || 0;
             request_body.customer_percentage_discount = request_body?.customer_percentage_discount || 0;
             request_body.maximum_discount_usage = request_body?.maximum_discount_usage || 0;
             request_body.maximum_discount_usage_per_order = request_body?.maximum_discount_usage_per_order || 0;
             request_body.percentage_discount_value = request_body?.percentage_discount_value || 0;
             request_body.exclude_shipping_amount = request_body?.exclude_shipping_amount || 0;

            if (request_body.id) {

                await AutomaticDiscounts.update(request_body, {
                    where: {
                        id: request_body.id,
                    },
                });
           } 
            else {
                console.log("--------------request",request_body)

               await AutomaticDiscounts.create(request_body);
        }  
        return res.json({
            status: true,
            message: "Discount added",
            redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/discounts`,
        }); 
        }
        catch (error) {
            console.error("error------------", error);
            return res.json({
                status: false,
                message: 'Something went wrong.Please check your details!',
            });
    }
}
    let automatic_discount = await AutomaticDiscounts.findOne({
        where: {
            store_id: store_id,

        },
    
    }).then((response) => {
        return response;
    });
    console.log("------------discount", automatic_discount)
    return res.render("backend/AutomaticDiscount/add_discount", {
        store_id:store_id,
        active_menu: "add-discount",
        automatic_discount:automatic_discount
    })
};

module.exports.delete_discount = async (req, res, next) => {
    let request_body = req.body;
    try {
      
        await AutomaticDiscounts.destroy({
            where: {
                id: request_body.id,
            },
        })
            return res.json({
                status: true,
                message:'Automatic Discount Deleted Successfully',
                redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/discounts`,
            });
    
    }
    catch(e) {
        return res.json({
            status:false,
            err:e,
            message:'Failed to delete discount'
        })
    }
    
};
