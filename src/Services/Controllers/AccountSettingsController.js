const { Users } = require("../models");
const bcrypt = require("bcryptjs");

// user account settings
module.exports.AccountSettings = async (req, res, next) => {
    const auth_user = req.auth_user;
    //let store_id = Buffer.from(req.params?.store_id, 'base64').toString();
    let store_id;
    if(req.body?.store_id){
        store_id = Buffer.from(req.body?.store_id, 'base64').toString();
    }else{
        store_id = "";
    }
    if (req.method === "POST") {
        try {
            let request_body = req.body;
            await Users.update(request_body, {
                where: {
                    id: auth_user?.id,
                },
            });
            return res.json({
                status: true,
                message: "Data updated succesfully",
                redirect_url: `${process.env.APP_URL}/${request_body?.store_id}/accountSettings`,
            });
        } catch (error) {
            return res.json({
                status: false,
                message: "Something went wrong",
            });
        }
    }
    
    res.render("backend/accountSettings", {
        select_store: true,
        store_id: store_id,
        user: auth_user,
        auth_user: auth_user,
    });
};

// user account settings
module.exports.AccountSettingsStore = async (req, res, next) => {
    const auth_user = req.auth_user;
    let store_id = Buffer.from(req.params.store_id, 'base64').toString();

    res.render("backend/accountSettings", {
        right_sides: [],
        user: auth_user,
        auth_user: auth_user,
        store_id: store_id,
    });
};


// user change password
module.exports.ChangePassword = async (req, res, next) => {
  
    try {
        if (req.method === "POST") {
            let userId = "";
            if (req.session.user) {
                let session = req.session.user;
                userId = session.id;
            }
            
            let request_body = req.body;
            if (userId !== null || userId !== undefined) {
                if (!request_body.current_password || !request_body.new_password || !request_body.confirm_password) {
                    return res.json({
                        status: false,
                        message: "Missing parameters",
                    });
                }
                if (request_body.new_password !== request_body.confirm_password) {
                    return res.json({
                        status: false,
                        message: "Confirm password not matched!",
                    });
                }
                const user = await Users.scope("withPassword").findOne({
                    where: {
                        id: userId,
                    },
                });
                if (!user || !(await bcrypt.compare(request_body.current_password, user.password))) {
                    return res.json({
                        status: false,
                        message: "Password does not matched with current password",
                    });
                }
                if (request_body.new_password) {
                    user.password = await bcrypt.hash(request_body.new_password, 10);
                }

                const updateUser = await Users.update(
                    {
                        password: user.password,
                    },
                    {
                        where: {
                            id: userId,
                        },
                    }
                );
                if (updateUser) {
                    return res.json({
                        status: true,
                        message: "Password updated succesfully",
                        redirect_url: `${process.env.APP_URL}/logout`,

                    });
                } else {
                    return res.json({
                        status: false,
                        message: "Unable to update the password",
                    });
                }
            } else {
                return res.json({
                    status: false,
                    message: "Session User id not found!Please login again",
                });
            }
        }
    } catch (e) {
        console.log("------err ", e)
        return res.json({
            status: false,
            message: "Something went wrong",
        });
    }
    res.render("backend/accountSettings", {
        user: req.session.user?.id,
    });
};
module.exports.ChangeAvatar = async (req, res, next) => {
    const auth_user = req.auth_user;

    try {
        const filename = req.file.filename
        const updateuserAvtar = await Users.update(
            {
                avatar: filename,
            },
            {
                where: {
                    id: auth_user?.id,
                },
            }
        );

        if (updateuserAvtar) {
            return res.json({
                status: true,
                message: "Profile Avatar added succesfully",
            })
        }
    } catch (error) {
        return res.json({
            status: false,
            message: "Something went wrong",
        });
    }
};
module.exports.DeleteAvatar = async (req, res, next) => {
    const auth_user = req.auth_user;

    try {
        const deleteuserAvtar = await Users.update(
            {
                avatar: null,
            },
            {
                where: {
                    id: auth_user?.id,
                },
            }
        );
        if (deleteuserAvtar) {
            return res.json({
                status: true,
                message: "Profile Avatar removed succesfully",
            })
        }
    } catch (error) {
        return res.json({
            status: false,
            message: "Something went wrong",
        });
    }

};