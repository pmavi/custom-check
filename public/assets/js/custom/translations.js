jQuery(document).ready(function () {
    let language = $("#display_language_name").val();
    if(language == ""){
        $("#display_language_name").val('English')
    }
    jQuery(document).on("click", "#show_change_language_model", function () {
        jQuery("#change_language_model").modal("show");
        let language = $("#display_language_name").val();
        
       $('#select_language option')
        .each(function(index) {
            if(index==0){
                $(this).text(language).val(language);
            }
        });
    });

    $(".select_preview").on("change", function (e) {
        var valueSelected = this.value;
        let lang =  $('#display_language_name').val();
        let url = $(":selected", this).attr("href");
        if (valueSelected === "Checkout") {
            window.location = url;
        }
        if (valueSelected === "Thank You") {
            window.location = url;
        }
    });

    jQuery("#translation").validate({
        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox") {
                element.parent().append(error);
            } else {
                element.parent().append(error);
            }
        },
        submitHandler: function (form) {
          // let lang =  $('#select_language').find(":selected").val();
          let lang =   $('#display_language_name').val();
            $('#translation').append("<input type='hidden' name='translation_language' value='"+
            lang+"' />");
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/translations`,
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
    
   
    jQuery(document).on("click", "#change_language", function () {
        const lang_value = jQuery("#select_language").val();
        jQuery("#display_language_name").val( lang_value);
        $("#translation").trigger("reset");
        $(".select_preview.form-select").val("Preview");

        jQuery.ajax({
            type: "POST",
            cache: false,
            dataType: "json",
            data: { selected_language: lang_value },
            url: `${ajax_url}/change-language`,
            success: function (response) {
                jQuery("form#translation input#shipping_details_title").val(response?.lang?.shipping_details);
                jQuery("form#translation input#first_name").val(response?.lang?.first_name);
                jQuery("form#translation input#last_name").val(response?.lang?.last_name);
                jQuery("form#translation input#email").val(response?.lang?.email);
                jQuery("form#translation input#phone").val(response?.lang?.phone);
                jQuery("form#translation input#address_number").val(response?.lang?.address_number);
                jQuery("form#translation input#zip_code").val(response?.lang?.zip_code);
                jQuery("form#translation input#city").val(response?.lang?.city);
                jQuery("form#translation input#state").val(response?.lang?.state);
                jQuery("form#translation input#country_action").val(response?.lang?.country_action);
                jQuery("form#translation input#company").val(response?.lang?.company);
                jQuery("form#translation input#marketing_checkbox").val(response?.lang?.marketing_checkbox);
                jQuery("form#translation input#billing_details").val(response?.lang?.billing_details);
                jQuery("form#translation input#same_billing_details").val(response?.lang?.same_billing_details);

                jQuery("form#translation input#shipping_option_title").val(response?.lang?.shipping_option_title);
                jQuery("form#translation input#shipping_option_title_error").val(response?.lang?.shipping_option_title_error);

                jQuery("form#translation input#order_summary_title").val(response?.lang?.order_summary_title);
                jQuery("form#translation input#show_order_summary").val(response?.lang?.show_order_summary);
                jQuery("form#translation input#hide_order_summary").val(response?.lang?.hide_order_summary);
                jQuery("form#translation input#subtotal").val(response?.lang?.subtotal);
                jQuery("form#translation input#discount_code").val(response?.lang?.discount_code);
                jQuery("form#translation input#discount").val(response?.lang?.discount);
                jQuery("form#translation input#delivery").val(response?.lang?.delivery);
                jQuery("form#translation input#free").val(response?.lang?.free);
                jQuery("form#translation input#total").val(response?.lang?.total);

                jQuery("form#translation input#invalid_discount_code").val(response?.lang?.invalid_discount_code);
                jQuery("form#translation input#discount_code_label").val(response?.lang?.discount_code_label);
                jQuery("form#translation input#apply_button").val(response?.lang?.apply_button);

                jQuery("form#translation input#payment_method").val(response?.lang?.payment_method);
                jQuery("form#translation input#credit_card").val(response?.lang?.credit_card);
                jQuery("form#translation input#and_more").val(response?.lang?.and_more);
                jQuery("form#translation input#credit_card_holder_label").val(response?.lang?.credit_card_holder_label);
                jQuery("form#translation input#credit_card_number_label").val(response?.lang?.credit_card_number_label);
                jQuery("form#translation input#credit_card_number_placeholder").val(response?.lang?.credit_card_number_placeholder);
                jQuery("form#translation input#credit_card_expiry_date").val(response?.lang?.credit_card_expiry_date);
                jQuery("form#translation input#expire_date_placeholder").val(response?.lang?.expire_date_placeholder);
                jQuery("form#translation input#expiry_date_long").val(response?.lang?.expiry_date_long);
                jQuery("form#translation input#discount_code_label").val(response?.lang?.discount_code_label);
                jQuery("form#translation input#security_code").val(response?.lang?.security_code);
                jQuery("form#translation input#cvv_placeholder").val(response?.lang?.cvv_placeholder);
                jQuery("form#translation input#valid_card").val(response?.lang?.valid_card);
                jQuery("form#translation input#redirected_to_external_window").val(response?.lang?.redirected_to_external_window);
                jQuery("form#translation input#redirected_to_free_purchase").val(response?.lang?.redirected_to_free_purchase);
                jQuery("form#translation input#cash_on_delivery").val(response?.lang?.cash_on_delivery);
                jQuery("form#translation input#bank_transfer").val(response?.lang?.bank_transfer);
                jQuery("form#translation input#klarna_pay_later").val(response?.lang?.klarna_pay_later);
                jQuery("form#translation input#klarna_slice_it").val(response?.lang?.klarna_slice_it);
                jQuery("form#translation input#complete_purchase_button").val(response?.lang?.complete_purchase_button);
                jQuery("form#translation input#complete_purchase_with").val(response?.lang?.complete_purchase_with);
                jQuery("form#translation input#secured_transaction").val(response?.lang?.secured_transaction);
                jQuery("form#translation input#free_on_completed").val(response?.lang?.free_on_completed);
                jQuery("form#translation input#free_purchase").val(response?.lang?.free_purchase);
                jQuery("form#translation input#ineligible_country").val(response?.lang?.ineligible_country);
                jQuery("form#translation input#ineligilble_country_steps").val(response?.lang?.ineligilble_country_steps);
                jQuery("form#translation input#too_low_amount").val(response?.lang?.too_low_amount);
                jQuery("form#translation input#too_low_amt_step").val(response?.lang?.too_low_amt_step);
                jQuery("form#translation input#pay_price").val(response?.lang?.pay_price);

                jQuery("form#translation input#return_policy_link").val(response?.lang?.return_policy_link);
                jQuery("form#translation input#privacy_policy_link").val(response?.lang?.privacy_policy_link);
                jQuery("form#translation input#terms_and_cond").val(response?.lang?.terms_and_cond);

                jQuery("form#translation input#processing_payment").val(response?.lang?.processing_payment);
                jQuery("form#translation input#create_order").val(response?.lang?.create_order);
                jQuery("form#translation input#loading_checkout").val(response?.lang?.loading_checkout);

                jQuery("form#translation input#purchase_button").val(response?.lang?.purchase_button);
                jQuery("form#translation input#cancel_button").val(response?.lang?.cancel_button);
                jQuery("form#translation input#buy_button").val(response?.lang?.buy_button);

                jQuery("form#translation input#order_completed").val(response?.lang?.order_completed);

                jQuery("form#translation input#purchase_completed_title").val(response?.lang?.purchase_completed_title);
                jQuery("form#translation input#order_receive").val(response?.lang?.order_receive);
                jQuery("form#translation input#shipping_address_title").val(response?.lang?.shipping_address_title);
                jQuery("form#translation input#billing_address_title").val(response?.lang?.billing_address_title);
                jQuery("form#translation input#billing_same_as_shipping").val(response?.lang?.billing_same_as_shipping);
                jQuery("form#translation input#shipping_method_title").val(response?.lang?.shipping_method_title);
                jQuery("form#translation input#payment_title").val(response?.lang?.payment_title);
                jQuery("form#translation input#order_recap").val(response?.lang?.order_recap);
                jQuery("form#translation input#additional_items").val(response?.lang?.additional_items);
                jQuery("form#translation input#back_to_shop").val(response?.lang?.back_to_shop);

                jQuery("form#translation input#default_subjects").val(response?.lang?.default_subjects);
                jQuery("form#translation input#default_title").val(response?.lang?.default_title);
                jQuery("form#translation input#default_greeting").val(response?.lang?.default_greeting);
                jQuery("form#translation input#default_message").val(response?.lang?.default_message);
                jQuery("form#translation input#default_call_to_action").val(response?.lang?.default_call_to_action);
                jQuery("form#translation input#or").val(response?.lang?.or);
                jQuery("form#translation input#visit_website").val(response?.lang?.visit_website);
                jQuery("form#translation input#cart_title").val(response?.lang?.cart_title);
                jQuery("form#translation input#default_disclaimer").val(response?.lang?.default_disclaimer);

                jQuery("form#translation input#accept_marketing_checkbox").val(response?.lang?.accept_marketing_checkbox);
                jQuery("form#translation input#consent").val(response?.lang?.consent);

                jQuery("form#translation input#invalid").val(response?.lang?.invalid);
                jQuery("form#translation input#payment_failed").val(response?.lang?.payment_failed);
               jQuery("#change_language_model").modal("hide");

                $('#translation').append("<input type='hidden' name='translation_language' value='"+
                response?.name+"'/>");
            
                jQuery.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    contentType: false,
                    processData: false,
                    data:  new FormData( $('form#translation' )[0] ),
                    url: `${ajax_url}/translations`,
                    mimeType: "multipart/form-data",
                    success: function (response) {
                        console.log("login_form response.redirect_url------------", response.redirect_url);
                        if (response?.status) {
                            setTimeout(function () {
                                window.location.href = response?.redirect_url;
                                $("form")[0].reset()
                            }, 1000);
                        } else {
                            jQuery.notify({ message: response.message }, { type: "danger" });
                        }
                    },
                });
            },
      
         });
    });
   
});