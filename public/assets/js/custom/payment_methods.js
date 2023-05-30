jQuery(document).ready(function () {
    jQuery("#select_payment_method").on("change", function () {
        var value = jQuery(this).val();
        jQuery(".payment-method-keys ").show();

        if (value === "Stripe") {
            jQuery("#stripe-method").show();
            jQuery("#paypal-method").hide();
            jQuery("#checkout-method").hide();
            jQuery("#klarna-method").hide();
        } else if (value === "PayPal") {
            jQuery("#paypal-method").show();
            jQuery("#checkout-method").hide();
            jQuery("#klarna-method").hide();
            jQuery("#stripe-method").hide();
        } else if (value === "Checkout.com") {
            jQuery("#checkout-method").show();
            jQuery("#klarna-method").hide();
            jQuery("#stripe-method").hide();
            jQuery("#paypal-method").hide();
        } else if (value === "Klarna") {
            jQuery("#klarna-method").show();
            jQuery("#stripe-method").hide();
            jQuery("#paypal-method").hide();
            jQuery("#checkout-method").hide();
        }
    });

    jQuery("#add_payment_method").validate({
        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox") {
                element.parent().append(error);
            } else {
                element.parent().append(error);
            }
        },
        submitHandler: function (form) {
            jQuery("form#add_payment_method :submit").attr("disabled", true);
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/add-payment-method`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () {
                            window.location.href = response?.redirect_url;
                        }, 1500);
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                        jQuery("form#add_payment_method :submit").attr("disabled", false);
                    }
                },
            });
        },
    });

    jQuery("#edit_payment_method").validate({
        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox") {
                element.parent().append(error);
            } else {
                element.parent().append(error);
            }
        },
        submitHandler: function (form) {
            jQuery("form#edit_payment_method :submit").attr("disabled", true);

            let id = jQuery("button[type=submit]").attr("id");
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/edit-payment-method/${id}`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () {
                            window.location.href = response?.redirect_url;
                        }, 1500);
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                        jQuery("form#edit_payment_method :submit").attr("disabled", false);
                    }
                },
            });
        },
    });

    jQuery(".delete_payment_method").click(function () {
        let payment_method_id = this.id;
        let store_id = $("#store_id").val();

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this payment method again!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                jQuery.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    contentType: "application/json",
                    processData: false,
                    url: `${ajax_url}/delete-payment-method`,
                    data: JSON.stringify({ payment_method_id: payment_method_id, store_id: store_id }),
                    success: function (response) {
                        if (response?.status) {
                            swal("Your payment method  has been deleted!", {
                                icon: "success",
                            });
                            setTimeout(function () {
                                window.location.href = response?.redirect_url;
                            }, 1500);
                        } else {
                            swal(response.message);
                        }
                    },
                });
            } else {
                swal("Your Payment Method is safe!");
            }
        });
    });
});