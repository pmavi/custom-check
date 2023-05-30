jQuery(document).ready(function () {
    let country_codes = [];
    jQuery(document).on("click", "#region-checkbox-Africa", function () {
        jQuery(".region-Africa").prop("checked", jQuery(this).prop("checked"));
    });

    jQuery(document).on("click", "#region-checkbox-Americas", function () {
        jQuery(".region-Americas").prop("checked", jQuery(this).prop("checked"));
    });

    jQuery(document).on("click", "#region-checkbox-Asia", function () {
        jQuery(".region-Asia").prop("checked", jQuery(this).prop("checked"));
    });

    jQuery(document).on("click", "#region-checkbox-Europe", function () {
        jQuery(".region-Europe").prop("checked", jQuery(this).prop("checked"));
    });

    jQuery(document).on("click", "#region-checkbox-Oceania", function () {
        jQuery(".region-Oceania").prop("checked", jQuery(this).prop("checked"));
    });

    jQuery(document).on("click", "#shipping_rate_price", function (e) {
        jQuery(this).removeClass("error");
    });

    jQuery(document).on("click", "#shipping_rate_min_amount", function (e) {
        jQuery(this).removeClass("error");
    });

    jQuery(document).on("click", "#shipping_rate_max_amount", function (e) {
        jQuery(this).removeClass("error");
    });

    jQuery(document).on("click", "#update_btn", function () {
        country_codes = [];
        jQuery("#countries").html("");
        jQuery("#item-flags").html("");
        jQuery("#validate-error").css("display", "none");

        jQuery("input:checkbox:checked.custom-control-input").each(function () {
            let id = jQuery(this).attr("id");
            let text = jQuery('label[for="' + id + '"]').html();
            let code = jQuery(this).val();
            if (code != "on") {
                country_codes.push({
                    country_code: code,
                    country_name: text,
                });
            }
        });
        if (country_codes.length > 0) {
            var html;
            let countries_count;
            for (let index = 0; index < country_codes.length; index++) {
                const country_details = country_codes[index];
                if (index < 3) {
                    html = '<span class="flags-icons fi fi-' + country_details.country_code.toLowerCase() + '" ></span>' + country_details.country_name;
                    jQuery("#countries").append(html);
                }
            }
            if (country_codes.length >= 3) {
                countries_count = country_codes.length - 3;
                let count = " +" + countries_count + " others";
                jQuery("#countries").append(count);
            }
            jQuery("#contriesPicker").modal("toggle");
            jQuery("#validate-error").css("display", "none");
        } else {
            jQuery("#validate-error").css("display", "block");
        }
    });

    jQuery(".model_close").on("click", function (e) {
        jQuery("#contriesPicker").modal("toggle");
    });

    jQuery("#add_shipping_rates").validate({
        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox") {
                element.parent().append(error);
            } else {
                element.parent().append(error);
            }
        },
        submitHandler: function (form) {
            jQuery("form#add_shipping_rates :submit").attr("disabled", true);
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/add-shipping-rate`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () {
                            window.location.href = response?.redirect_url;
                        }, 1500);
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                        jQuery("form#add_shipping_rates :submit").attr("disabled", false);
                    }
                },
            });
        },
    });

    jQuery(document).on("click", ".table-row", function () {
        let id = jQuery(this).attr("id");
        let store_id = jQuery(this).attr("store_id");
        window.location.href = `${ajax_url}/${store_id}/edit-shipping-rate/${id}`;
    });

    jQuery("#edit_shipping_rates").validate({
        errorPlacement: function (error, element) {
            if (element.attr("type") == "checkbox") {
                element.parent().append(error);
            } else {
                element.parent().append(error);
            }
        },
        submitHandler: function (form) {
            jQuery("form#edit_shipping_rates :submit").attr("disabled", true);
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: new FormData(form),
                url: `${ajax_url}/edit-shipping-rate`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () {
                            window.location.href = response?.redirect_url;
                        }, 1500);
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                        jQuery("form#edit_shipping_rates :submit").attr("disabled", false);
                    }
                },
            });
        },
    });

    jQuery(".delete_shipping_rate").click(function () {
        let shipping_rate_id = this.id;
        let store_id = jQuery(this).attr("store_id");

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this shipping rate again!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                jQuery.ajax({
                    type: "DELETE",
                    cache: false,
                    dataType: "json",
                    contentType: "application/json",
                    processData: false,
                    data: JSON.stringify({
                        store_id: store_id,
                        shipping_rate_id: shipping_rate_id,
                    }),
                    url: `${ajax_url}/delete-shipping-rate`,
                    success: function (response) {
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
            } else {
                swal("Your Shipping Rate is safe!");
            }
        });
    });
});