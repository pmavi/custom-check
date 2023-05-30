const REQ_URL = "http://localhost:8001";

jQuery(document).ready(function () {
    console.log("checkout_detail-----------", checkout_detail);
    let timer;
    let fontSize = jQuery("#font_size").val();
    if (fontSize != "" || fontSize != null || fontSize != undefined) {
        jQuery(".main-data").css("font-size", parseInt(fontSize) + "px");
    }
    if (jQuery("#lang-btn").val() != undefined) {
        timer = setInterval(checkScriptExists, 1000);
        setTimeout(function () {
            translateLanguage(this.value);
        }, 1000);
    }

    function checkScriptExists() {
        var google_script_url = "https://translate.google.com/translate_a/element.js";
        if (jQuery("script[src*='" + google_script_url + "']")[0]) {
            // run google translate function
            new google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: true,
                },
                "google_translate_element"
            );
            clearInterval(timer);
            return;
        }
    }

    function translateLanguage(lang) {
        checkScriptExists();
        var frame = jQuery(".goog-te-menu-frame:first");
        if (
            frame
                .contents()
                .find(".goog-te-menu2-item span.text:contains(" + lang + ")")
                .get(0) != undefined
        ) {
            frame
                .contents()
                .find(".goog-te-menu2-item span.text:contains(" + lang + ")")
                .get(0)
                .click();
        }
        return false;
    }

    jQuery("input").bind("focus", function (e) {
        let id = jQuery("input[name=" + this.name + "]").attr("id");
        if (jQuery("input[name=" + this.name + "]").val().length === 0) {
            jQuery("input[name=" + this.name + "]").css("border-color", id);
        }
    });

    jQuery("input").focusout(function (e) {
        let myClass = jQuery("input[name=" + this.name + "]").attr("class"),
            id = jQuery("input[name=" + this.name + "]").attr("id");
        if (jQuery("input[name=" + this.name + "]").val().length === 0) {
            jQuery("input[name=" + this.name + "]").css("border-color", myClass);
            jQuery("p" + id).css("display", "block");
        }
    });

    jQuery("input").on("change", function (e) {
        let myclass = jQuery("input[name=" + this.name + "]").attr("class");
        let id = jQuery("input[name=" + this.name + "]").attr("id");

        if (jQuery("input[name=" + this.name + "]").val().length === 0) {
            jQuery("input[name=" + this.name + "]").css("border-color", myclass);
            jQuery("p" + id).css("display", "block");
        } else {
            jQuery("input[name=" + this.name + "]").css("border-color", "#c7c7c7");
            jQuery("p" + id).css("display", "none");
        }
    });

    jQuery("#billing-checkbox").on("change", function (e) {
        let isChecked = jQuery("#billing-checkbox")[0].checked;
        if (!isChecked) {
            jQuery("#billing-details").css("display", "block");
        } else {
            jQuery("#billing-details").css("display", "none");
        }
    });

    jQuery('input[name="payment_method"]').change(function () {
        // bind a function to the change event
        if (jQuery(this).is(":checked")) {
            // check if the radio is checked
            var val = jQuery(this).val(); // retrieve the value
            if (val == "Stripe") {
                jQuery("#pay_button").prop("disabled", true);
                jQuery(".credit_card").show("slow");
            } else {
                jQuery("#pay_button").prop("disabled", false);
                jQuery(".credit_card").hide("slow");
            }
        }
    });

    jQuery(".credit_card input[type=text]").on("keyup", function () {
        cardFormValidate();
    });

    jQuery(".pay-on-button").bind("click", async function () {
        let payButton = await shippingDetailValidation();
        if (payButton) {
            var select_option = document.querySelector('input[name="payment_method"]:checked').value;
            console.log("select_option------------", select_option);

            if (select_option) {
                if (select_option == "Stripe") {
                    paymentGateway(select_option);
                }
                if (select_option == "PayPal") {
                    paymentGateway(select_option);
                }
            }
        }
    });
});

function cardFormValidate() {
    var cardValid = 0;
    //card number validation
    jQuery("#card_number").validateCreditCard(function (result) {
        if (result.valid) {
            jQuery("#card_number").removeClass("requiredBorder");
            cardValid = 1;
        } else {
            console.log("enter validation");
            jQuery("#card_number").addClass("requiredBorder");
            cardValid = 0;
        }
    });

    //card details validation
    var expMonth = jQuery("#expiry_month").val();
    var expYear = jQuery("#expiry_year").val();
    var cvv = jQuery("#cvv").val();
    var regMonth = /01|02|03|04|05|06|07|08|09|10|11|12/gi;
    var regYear = /^2023|2024|2025|2026|2027|2028|2029|2030|2031$/;
    var regCVV = /^[0-9]{3,3}$/;
    // /_createdDate|_createdTime|user_name|bid_name|APP_URL|APP_BUILD_URL|bidhq_view_link|bid_due_date|user_icon|client_name/gi,
    if (cardValid == 0) {
        jQuery("#card_number").addClass("requiredBorder");
        jQuery("#card_number").focus();
        return false;
    } else if (!regMonth.test(expMonth)) {
        console.log(regMonth.test(expMonth));
        jQuery("#card_number").removeClass("requiredBorder");
        jQuery("#expiry_month").addClass("requiredBorder");
        jQuery("#expiry_month").focus();
        return false;
    } else if (!regYear.test(expYear)) {
        jQuery("#card_number").removeClass("requiredBorder");
        jQuery("#expiry_month").removeClass("requiredBorder");
        jQuery("#expiry_year").addClass("requiredBorder");
        jQuery("#expiry_year").focus();
        return false;
    } else if (!regCVV.test(cvv)) {
        jQuery("#card_number").removeClass("requiredBorder");
        jQuery("#expiry_month").removeClass("requiredBorder");
        jQuery("#expiry_year").removeClass("requiredBorder");
        jQuery("#cvv").addClass("requiredBorder");
        jQuery("#cvv").focus();
        return false;
    } else {
        jQuery("#card_number").removeClass("requiredBorder");
        jQuery("#expiry_month").removeClass("requiredBorder");
        jQuery("#expiry_year").removeClass("requiredBorder");
        jQuery("#cvv").removeClass("requiredBorder");
        jQuery("#pay_button").prop("disabled", false);
        return true;
    }
}

async function shippingDetailValidation() {
    var email = jQuery("input[name='email']").val(),
        first_name = jQuery("input[name='first_name']").val(),
        last_name = jQuery("input[name='last_name']").val(),
        address = jQuery("input[name='address']").val(),
        phone = jQuery("input[name='phone']").val(),
        city = jQuery("input[name='city']").val(),
        zip = jQuery("input[name='zip_code']").val(),
        country = jQuery("input[name='country']").val(),
        state = jQuery("input[name='state']").val(),
        emailRegex = /^([_\-\.0-9a-zA-Z]+)@([_\-\.0-9a-zA-Z]+)\.([a-zA-Z]){2,7}$/,
        zipCode = /^\d{5}(?:-?\d{4})?$/;

    console.log("shippingDetailValidation first_name -------------", first_name);

    if (!email) {
        jQuery("#email").show();
        jQuery("input[name='email']").css("border-color", jQuery("input[name='email']").attr("class"));
    } else {
        if (!emailRegex.test(email)) {
            jQuery("#email").html("Enter valid email");
            jQuery("input[name='email']").css("border-color", jQuery("input[name='email']").attr("class"));
        } else {
            console.log("$('#email').attr('id')", $("input[name='email']").attr("class"));
            jQuery("#email").hide();
        }
    }

    if (!first_name) {
        jQuery("#first_name").show();
        jQuery("input[name='first_name']").css("border-color", jQuery("input[name='first_name']").attr("class"));
    } else {
        jQuery("#first_name").hide();
    }
    if (!last_name) {
        jQuery("#last_name").show();
        jQuery("input[name='last_name']").css("border-color", jQuery("input[name='last_name']").attr("class"));
    } else {
        jQuery("#last_name").hide();
    }
    if (!address) {
        jQuery("#address").show();
        jQuery("input[name='address']").css("border-color", jQuery("input[name='address']").attr("class"));
    } else {
        jQuery("#address").hide();
    }
    if (!phone) {
        jQuery("#phone").show();
        jQuery("input[name='phone']").css("border-color", jQuery("input[name='phone']").attr("class"));
    } else {
        jQuery("#phone").hide();
    }
    if (!city) {
        jQuery("#city").show();
        jQuery("input[name='city']").css("border-color", jQuery("input[name='city']").attr("class"));
    } else {
        jQuery("#city").hide();
    }
    if (!zip) {
        jQuery("#zip_code").show();
        jQuery("input[name='zip_code']").css("border-color", jQuery("input[name='zip_code']").attr("class"));
    } else {
        if (!zipCode.test(zip)) {
            jQuery("#zip_code").html("Enter valid Zip code");
            jQuery("input[name='zip_code']").css("border-color", jQuery("input[name='zip_code']").attr("class"));
        } else {
            jQuery("#zip_code").hide();
        }
    }
    // if (!country) {
    //     jQuery("#country").show();
    //     jQuery("input[name='country']").css("border-color", jQuery("input[name='country']").attr("class"));
    // } else {
    //     jQuery("#country").hide();
    // }
    // if (!state) {
    //     jQuery("#state").show();
    //     jQuery("input[name='state']").css("border-color", jQuery("input[name='state']").attr("class"));
    // } else {
    //     jQuery("#state").hide();
    // }

    if (emailRegex.test(email) && first_name && last_name && address && city && zipCode.test(zip) && phone) {
        var order_detail = {
            // store_name: SHOP_DOMAIN,
            email: email,
            first_name: first_name,
            last_name: last_name,
            address: address,
            city: city,
            zipCode: zip,
            country: country,
            state: state,
        };
        // await jQuery.ajax({
        //     type: "POST",
        //     url: `${REQ_URL}/order-create`,
        //     data: { data: JSON.stringify(order_detail) },
        //     success: function (response) {
        //         if (response.success) {
        //             return true;
        //         }
        //     },
        //     error: function (response) {
        //         console.log(response.responseText, "response error");
        //     },
        // });
        return true;
    } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return false;
    }
}

async function paymentGateway(select_option) {
    console.log(card_number, cvv);
    switch (select_option) {
        case "Stripe":
            StripePayment(product_details, checkout_detail);
            break;
        case "PayPal":
            PayPalPayment(product_details);
            break;
        case "cash_on_delivery":
            CashOnDelivery();
            break;
        default:
        // code block
    }
}

function StripePayment(product_details, checkout_detail) {
    // Stripe payment
    var expiry_month = jQuery("#expiry_month").val(),
        expiry_year = jQuery("#expiry_year").val(),
        cvv = jQuery("#cvv").val(),
        card_number = jQuery("#card_number").val();

    let subTotal = 0;
    product_details.forEach((element) => {
        subTotal += parseFloat(element.quantity * element.price);
    });
    let Customer = CustomerDetail(checkout_detail);
    console.log(subTotal, "subTotal");
    jQuery.ajax({
        type: "POST",
        dataType: "json",
        url: `${REQ_URL}/pay`,
        data: {
            price: subTotal,
            currency_name: "USD",
            card_number: card_number,
            expiry_month: expiry_month,
            expiry_year: expiry_year,
            cvv: cvv,
            email: Customer.email,
            first_name: Customer.first_name,
            last_name: Customer.last_name,
            method: "stripe",
        },
        success: function (response) {
            if (response.response.status) {
                jQuery.ajax({
                    type: "POST",
                    url: `${REQ_URL}/order-create`,
                    data: { data: JSON.stringify(Customer) },
                    success: function (response) {
                        if (response.success) {
                            return true;
                        }
                    },
                    error: function (response) {
                        console.log(response.responseText, "response error");
                    },
                });
                window.location.href = `http://" + window.location.host + /${checkout_detail.shop_id}/checkout_thanks/${checkout_detail.id}`;
            }
            console.log(response, "response");
        },
        error: function (response) {
            console.log(response.responseText, "response error");
        },
    });
}

async function PayPalPayment(product_details) {
    // Paypal payment
    var payment_url = "";
    console.log(product_details, "product_detailsproduct_detailsproduct_details");
    var productData = [];

    product_details.forEach((element) => {
        productData.push({
            name: element.title,
            price: parseFloat(element.price),
            currency: "USD",
            quantity: element.quantity,
        });
    });

    let CustomerDetails = CustomerDetail();

    await jQuery.ajax({
        type: "POST",
        url: `${REQ_URL}/pay`,
        data: {
            data: JSON.stringify(productData),
            method: "paypal",
            single: true,
        },
        success: function (response) {
            console.log(response.payment_url);
            if (response.payment_url) {
                return (payment_url = response.payment_url);
            }
        },
        error: function (response) {
            alert(response.responseText);
        },
    });
    window.location.href = payment_url;
}

function CustomerDetail(checkout_detail) {
    var email = jQuery("input[name='email']").val(),
        first_name = jQuery("input[name='first_name']").val(),
        last_name = jQuery("input[name='last_name']").val(),
        address = jQuery("input[name='address']").val(),
        phone = jQuery("input[name='phone']").val(),
        city = jQuery("input[name='city']").val(),
        zip = jQuery("input[name='zip_code']").val(),
        country = jQuery("input[name='country']").val(),
        state = jQuery("input[name='state']").val();

    var order_detail = {
        store_id: checkout_detail.shop_id,
        email: email,
        first_name: first_name,
        last_name: last_name,
        address: address,
        phone: phone,
        city: city,
        zipCode: zip,
        country: country,
        state: state,
    };
    return order_detail;
}