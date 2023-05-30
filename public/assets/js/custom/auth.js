jQuery(document).ready(function () {
   
    $("#register_btn").removeAttr("disabled");
    $("#forgot_pwd_link").removeAttr("disabled");
    $("#create_account_link").removeAttr("disabled");
    $("#go_back_login").removeAttr("disabled");
    $("#reset_pwd_btn").removeAttr("disabled");
    $("#login_button_id").removeAttr("disabled");
    
    $("#register_form input[name=first_name]").on("change", function () {
        $("#register_form input[name=first_name]").val($.trim($("#register_form input[name=first_name]").val()))
    });
    $("#register_form input[name=last_name]").on("change", function () {
        $("#register_form input[name=last_name]").val($.trim($("#register_form input[name=last_name]").val()))
    });

    jQuery("#login_form").validate({
        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox") {
                element.parent().append(error);
            } else {
                element.parent().append(error);
            }
        },
        submitHandler: function (form) {
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/login`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    console.log("login_form response.redirect_url------------", response.redirect_url);
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () {
                            window.location.href = response?.redirect_url;
                        }, 1500);
                      
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                    
                    }
                },
            });
        },
    });
   
  
    $("#password").on('keyup', function(){
        var number = /([0-9])/;
        var alphabets = /([a-zA-Z])/;
        var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
        if ($('#password').val().length < 6) {
            $('#password-strength-status').removeClass();
            $('#password-strength-status').addClass('weak-password');
            $('#password-strength-status').html("Weak (should be atleast 6 characters.)");
        } else {
            if ($('#password').val().match(number) && $('#password').val().match(alphabets) && $('#password').val().match(special_characters)) {
                $('#password-strength-status').removeClass();
                $('#password-strength-status').addClass('strong-password');
                $('#password-strength-status').html("Strong");
            } else {
                $('#password-strength-status').removeClass();
                $('#password-strength-status').addClass('medium-password');
                $('#password-strength-status').html("Medium (should include alphabets, numbers and special characters or some combination.)");
            }
        }
      });
    jQuery("#register_form").validate({
        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox") {
                element.parent().append(error);
            } else {
                element.parent().append(error);
            }
        },
        submitHandler: function (form) {
         
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/register`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    console.log("register_form response.redirect_url------------", response.redirect_url)
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () {
                            window.location.href = response?.redirect_url;
                        }, 1500);
                     
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                      
                    }
                },
            });
        },
    });

    $("#email-forgot").on("change", function () {
        $("#code-send").removeAttr("disabled");
    })

    jQuery("#forgot_password").validate({
        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox") {
                element.parent().append(error);
            } else {
                element.parent().append(error);
            }
        },
        submitHandler: function (form) {
            $("#code-send").hide();
            $("#loading_button").show();
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/forgotPassword`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () {
                            window.location.href = `${ajax_url}/resetPassword?email=${response.user}`;
                        }, 2000);
                        $("#code-send").show();
                        $("#code-send").attr("disabled", "disabled");
                        $("#loading_button").hide();
                        $("#forgot_password input").attr("disabled", "disabled");
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                        $("#code-send").show();
                        $("#loading_button").hide();
                    }
                },
            });
        },
    });

    let queryString = window.location.search
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email')

    jQuery("#verify_password").validate({

        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox") {
                element.parent().append(error);
            } else {
                element.parent().append(error);
            }
        },
        submitHandler: function (form) {
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/resetPassword?email=` + email,
                mimeType: "multipart/form-data",
                success: function (response) {
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () {
                            window.location.href = `${ajax_url}/login`;
                        }, 1500);
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                    }
                },
            });
        },
    });
});