const {  Stores , CustomDomain } = require("../models");
const { VerifyDomain } = require("../../libs/Helper");

module.exports.custom_domain = async (req, res, next) => {
    const {store_id} = req.params;
    const auth_store = req.auth_store;
    const auth_user = req.auth_user;

    if(req.method === "POST"){
        try{
            let request_body = req.body;

            console.log("-------------request", request_body)
            if(!request_body.domain_host_name){
                return res.json({
                    status:false,
                    message:'Please enter the hostname first!'
                })
            }
            request_body.user_id = auth_user?.id;
            request_body.verified_status = false;
            
            await CustomDomain.create(request_body);
            return res.json({
                status: true,
                message: "Custom domain added " ,
                redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/add-custom-domain`,
            });

        } catch(e){
            return res.json({
                status:false,
                message:'Something went wrong.Please try again.'
            })
        }
    }
    let custom_domain =   await CustomDomain.findOne({
        store_id:store_id,
        user_id:auth_user?.id
    }).then((response)=>{
        return response;
    })
    return res.render("backend/CustomDomain/custom_domain", {
        store_id: store_id,
        auth_store:auth_store,
        custom_domain:custom_domain,
        active_menu:"custom-domain",
    });
};

module.exports.add_custom_domain = async (req, res, next) => {
    const {store_id} = req.params;
    const auth_store = req.auth_store;
    const auth_user = req.auth_user;

    if(req.method === "POST"){
        try{
            let request_body = req.body;

            let verify_domain = await VerifyDomain({
                domain_host_name: request_body?.domain_host_name,
               
            });
            console.log("-----domain", verify_domain)
            if (verify_domain) {
            
             request_body.verified_status = true;

            await CustomDomain.update(request_body ,
                {where:{
                    id:request_body.id
                }})
                return res.json({
                    status: true,
                    message: "Custom domain verified " ,
                    redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/custom-domain`,
                });
            }
            else{
                return res.json({
                    status:false,
                    message:'Invalid domain'
                })    
            }
           
        }
        catch(e){
            return res.json({
                status:false,
                message:'Something went wrong.Please try again.'
            })  
        }
    }
    let custom_domain =   await CustomDomain.findOne({
        store_id:store_id,
        user_id:auth_user?.id
    }).then((response)=>{
        return response;
    })
    return res.render("backend/CustomDomain/add_custom_domain", {
        store_id: store_id,
        auth_store:auth_store,
        custom_domain:custom_domain,
        active_menu:"add-custom-domain",
    });
};

module.exports.delete_custom_domain = async (req, res, next) => {
    const {store_id} = req.params;
     
     
    if(req.method == "POST"){
        let request_body = req.body;
        try{
            await CustomDomain.destroy({
               where: {id:request_body.id
            }});
            return res.json({
                status: true,
                message: "Custom domain deleted " ,
                redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/custom-domain`,
            });  
        }
        catch(e){
            return res.json({
                status:false,
                message:'Something went wrong.Please try again.'
            })  
        }
    }
};