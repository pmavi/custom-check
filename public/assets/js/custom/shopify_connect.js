jQuery(document).ready(function () {
    load_store_stepper();

    // Add your store
    jQuery("#store_name").validate({
        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox" || element.attr("type") == "radio") {
                element.parent().parent().parent().append(error);
            } else {
                element.parent().parent().append(error);
            }
        },
        submitHandler: function (form) {
            jQuery("form#store_name :submit").attr("disabled", true);
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/store-connect`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    jQuery("form#store_name :submit").attr("disabled", false);
                    if (response?.status && response.page.includes("store_scopes")) {
                        let sessionStorageData = {
                            shopDomain: response?.store_name,
                            shopApiKey: "",
                            shopSecretKey: "",
                            password: "",
                        };
                        window.sessionStorage.setItem("STORE_DATA", JSON.stringify(sessionStorageData));
                        window.sessionStorage.setItem("connect-store-step", "1");

                        load_store_stepper();
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                    }
                },
            });
        },
    });

    // Create a custom app
    jQuery("#store_scopes").validate({
        submitHandler: function (form) {
            window.sessionStorage.setItem("connect-store-step", 2);
            load_store_stepper();
        },
    });

    jQuery(document).on("click", ".clipboard_app_name", function () {
        let jquery_this = jQuery(this);
        let copy_content = jquery_this.parent().parent().find("input").val();

        var temp = jQuery("<input>");
        jQuery("body").append(temp);
        temp.val(copy_content).select();

        document.execCommand("copy");
        temp.remove();

        jQuery.notify({ message: "Copied" }, { type: "success" });
    });

    // Add app details
    jQuery("#store_details").validate({
        submitHandler: function (form) {
            jQuery("form#store_details :submit").attr("disabled", true);
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/store-connect`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    jQuery("form#store_details :submit").attr("disabled", false);
                    if (response?.status) {
                        if (response.page.includes("congrats_page")) {
                            jQuery.notify({ message: response.message }, { type: "success" });
                            sessionStorage.removeItem("connect-store-step");
                            sessionStorage.removeItem("STORE_DATA");

                            window.location.href = response?.redirect_url;
                        }

                        if (response.page.includes("incorrect_scopes")) {
                            window.sessionStorage.setItem(
                                "STORE_DATA",
                                JSON.stringify({
                                    shopDomain: response?.store_name,
                                    shopApiKey: response?.api_key,
                                    shopSecretKey: response?.secret_key,
                                    password: response?.password,
                                })
                            );

                            jQuery("#store_domain_verify").val(response?.store_name);
                            jQuery("#shopify_api_key_verify").val(response?.api_key);
                            jQuery("#shopify_secret_key_verify").val(response?.secret_key);
                            jQuery("#access_token_verify").val(response?.password);

                            jQuery(".store_details").hide();
                            jQuery(".store_verify_details").show();

                            let incorrect_scopes_html = "";
                            response?.incorrectScopes.map((element) => {
                                incorrect_scopes_html += `<input type="checkbox" value="${element}"checked> ${element}<br>`;
                            });
                            jQuery(".incorrect_scopes").html(incorrect_scopes_html);
                        }
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                    }
                },
            });
        },
    });

    // Add app details
    jQuery("#store_verify_details").validate({
        submitHandler: function (form) {
            jQuery("form#store_verify_details :submit").attr("disabled", true);
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/store-connect`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    jQuery("form#store_verify_details :submit").attr("disabled", false);

                    if (response?.status) {
                        jQuery(".incorrect_scopes").html("");
                        jQuery.notify({ message: response?.message }, { type: "success" });

                        if (response.page.includes("congrats_page")) {
                            jQuery.notify({ message: response.message }, { type: "success" });
                            sessionStorage.removeItem("connect-store-step");
                            sessionStorage.removeItem("STORE_DATA");

                            window.location.href = response?.redirect_url;
                        }

                        if (response.page.includes("incorrect_scopes")) {
                            jQuery(".store_details").hide();
                            jQuery(".store_verify_details").show();
                            let incorrect_scopes_html = "";
                            response?.incorrectScopes.map((element) => {
                                incorrect_scopes_html += `<input type="checkbox" value="${element}"checked> ${element}<br>`;
                            });
                            jQuery(".incorrect_scopes").html(incorrect_scopes_html);
                        }
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                    }
                },
            });
        },
    });
});

function load_store_stepper() {
    let getStoreData = window.sessionStorage.getItem("STORE_DATA");
    let domain = JSON.parse(getStoreData);
    if (domain?.shopDomain) {
        jQuery(".store_domain").val(domain?.shopDomain);
    }

    jQuery(".store_setup_stepper").hide();
    let getConnectStep = window.sessionStorage.getItem("connect-store-step");
    switch (getConnectStep) {
        case "1":
            jQuery(".store_scopes").show();
            break;

        case "2":
            jQuery(".store_details").show();
            break;

        case "3":
            jQuery(".store_verify_details").show();
            break;

        default:
            jQuery(".add_your_store").show();
            break;
    }
}