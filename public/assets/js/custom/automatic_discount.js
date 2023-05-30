jQuery(document).ready(function() {

    // date format
    let fdate = moment().format("YYYY-MM-DD");
    $("#active_from_date").val(fdate);
    $("#active_to_date").val(fdate);
    $("#active_date").html('Active from ' + fdate);
    $("#discount_cart").prop("checked", true);

    //array - variables
    let collection_arr = [];
    let variant_arr = [];
    let arr = [];
    let ids = [];

    // discount type -check
    if (!$("#discount_type_fixed").is(':checked') && !$("#discount_type_buy").is(':checked') && !$("#discount_type_free_shipping").is(':checked')) {
        $("#discount_type_percentage").prop("checked", true);
    }

    // discount type buy-check 
    if ($("#discount_type_buy").is(':checked')) {
        $('.buy-discount-type').show();
        $('.percentage-discount').hide();
        $('#specific_order_display').hide();
        $('#minimum_quantity_cart_check').show();
        $("#minimum_quantity_cart").prop("checked", true);
        $("#discount_free").prop("checked", true);
        $('.percentage-discount-fixed').hide();
        $('.percentage-discount-fixed-shipping').hide();
        $('#order_item').hide();
        $("#discount_type_percentage").prop("checked", false);
        $("#discount_type_fixed").prop("checked", false);
        $("#discount_type_free_shipping").prop("checked", false);

    }

    // discount type fixed percentage-check 
    if ($("#discount_type_fixed").is(':checked')) {
        $('.buy-discount-type').hide();
        $('.percentage-discount').hide();
        $('#specific_order_display').show();
        $('#minimum_quantity_cart_check').show();
        $("#discount_free").prop("checked", false);
        $('#p_discount').hide();
        $('#p_discount_amt').show();
        $('.percentage-discount-fixed').show();
        $('#specific_order_display_fixed').show();
        $('#discount_exclude').hide();
        $("#specific_order").prop("checked", true);
        $("#entire_order").prop("checked", false);
        $(".discount_value").show();
        $('.percentage-discount-fixed-shipping').show();
        $('#discount_exclude').hide();
        $('#discount_type').html('Fixed Amount');
        $('#order_item').show();
        $('#order_item').html('Entire Order');
        $("#discount_type_buy").prop("checked", false);
        $("#discount_type_percentage").prop("checked", false);
        $("#discount_type_free_shipping").prop("checked", false);
        $("#all_items").prop("checked", true);

    }

    // discount type  percentage-check 
    if ($("#discount_type_percentage").is(':checked')) {
        $('.buy-discount-type').hide();
        $('.percentage-discount').show();
        $('#specific_order_display_fixed').hide();
        $('#minimum_quantity_cart_check').show();
        $("#discount_free").prop("checked", false);
        $('#p_discount').show();
        $('.percentage-discount-fixed').show();
        $('#percentage-discount-criteria').show();
        $(".discount_value").show();
        $('.percentage-discount-fixed-shipping').show();
        $('#discount_exclude').hide();
        $('#order_item').show();
        $('#order_item').html('Entire Order');
        $("#discount_type_buy").prop("checked", false);
        $("#discount_type_fixed").prop("checked", false);
        $("#discount_type_free_shipping").prop("checked", false);

    }

    // discount type  free shipping-check 
    if ($("#discount_type_free_shipping").is(':checked')) {
        $(".discount_value").hide();
        $('.buy-discount-type').hide();
        $('.percentage-discount').show();
        $('#discount_type_fixed').prop("checked", false);
        $('#discount_type_buy').prop("checked", false);;
        $('#discount_type_percentage').prop("checked", false);
        $('.percentage-discount-fixed-shipping').hide();
        $('#specific_order_display_fixed').hide();
        $('#discount_exclude').show();
        $('#discount_type').html('Free Shipping');
        $('#order_item').hide();
        $('#discount_rate').hide();
    }

    // entire order select -check 
    if ($('#entire_order').is(':checked')) {
        $('#specific_order_display_fixed').hide();
        $('#discount_exclude').hide();
        $('#specific_order').prop("checked", false);

    }

    // specific order select -check
    if ($("#specific_order").is(':checked')) {
        $('#entire_order').prop("checked", false);
    }

    // show/hide discount usage field
    $("#discountUsage").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('#discountUsageChecked').show();
            $('#content_discount').css('margin-top', '-110px')

        } else {
            $('#discountUsageChecked').hide();
            $('#content_discount').css('margin-top', '-150px')

        }
    });

     // modal cancel button
    $('#cancel_btn').click(function() {
        $('#productPicker').modal('toggle');
    });

    //active end date - check
    $("#activeEndDate").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('#end-datetime').show();
            $('#content_discount').css('margin-top', '-60px')
        } else {
            $('#end-datetime').hide();
            $('#content_discount').css('margin-top', '-110px')

        }
    });

    // add additional options show/hide field -check
    $("#additionalOptions").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('#additional_options').show();
        } else {
            $('#additional_options').hide();
        }
    });

    // minimum cart quantity - check
    $("#minimum_quantity_cart").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('#minimum_quantity_cart_check').show();
            $("#cart_minimum_amt").prop("checked", false);
            $('#minimum_amount_cart_check').hide();
            $("#discount_free").prop("checked", false);

        }
    });

    // discount free field - check
    $("#discount_free").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $("#discount_percentage").prop("checked", false);
            $('#cus_p_discount').hide();

        }
    });

     // discount percentage field - check
    $("#discount_percentage").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $("#discount_free").prop("checked", false);
            $('#cus_p_discount').show();

        }
    });

    // cart minimum amount field- check
    $("#cart_minimum_amt").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('#minimum_amount_cart_check').show();
            $("#minimum_quantity_cart").prop("checked", false);
            $('#minimum_quantity_cart_check').hide();
        }
    });

    // discount type buy X Get Y - show/hide fields
    $("#discount_type_buy").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('.buy-discount-type').show();
            $('.percentage-discount').hide();
            $('#specific_order_display').hide();
            $('#minimum_quantity_cart_check').show();
            $("#minimum_quantity_cart").prop("checked", true);
            $("#discount_free").prop("checked", true);
            $('.percentage-discount-fixed').hide();
            $('.percentage-discount-fixed-shipping').hide();
            $('#discount_type').html('Buy X Get Y');
            $('#order_item').hide();
            $('#cart_limit').html('Minimum quantity reached in cart of 1 items');
            $('#discount_rate').html('Discounted %');
            $("#discount_type_percentage").prop("checked", false);
            $("#discount_type_fixed").prop("checked", false);
            $("#discount_type_free_shipping").prop("checked", false);


        }
    });

    // discount type percentage- show/hide fields
    $("#discount_type_percentage").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('.buy-discount-type').hide();
            $('.percentage-discount').show();
            $('#specific_order_display_fixed').hide();
            $('#minimum_quantity_cart_check').show();
            $("#discount_free").prop("checked", false);
            $('#p_discount').show();
            $('.percentage-discount-fixed').show();
            $('#percentage-discount-criteria').show();
            $(".discount_value").show();
            $('.percentage-discount-fixed-shipping').show();
            $('#discount_exclude').hide();
            $('#discount_type').html('Percentage');
            $('#cart_limit').html('Minimum quantity reached in cart of 1 items');
            $('#discount_rate').html('Discounted %');
            $('#order_item').show();
            $('#order_item').html('Entire Order');
            $("#discount_type_buy").prop("checked", false);
            $("#discount_type_fixed").prop("checked", false);
            $("#discount_type_free_shipping").prop("checked", false);


        }
    });

    // discount type percentage fixed- show/hide fields
    $("#discount_type_fixed").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('.buy-discount-type').hide();
            $('.percentage-discount').hide();
            $('#specific_order_display').show();
            $('#minimum_quantity_cart_check').show();
            $("#discount_free").prop("checked", false);
            $('#p_discount').hide();
            $('#p_discount_amt').show();
            $('.percentage-discount-fixed').show();
            $('#specific_order_display_fixed').show();
            $('#discount_exclude').hide();
            $("#specific_order").prop("checked", true);
            $("#entire_order").prop("checked", false);
            $(".discount_value").show();
            $('.percentage-discount-fixed-shipping').show();
            $('#discount_exclude').hide();
            $('#discount_type').html('Fixed Amount');
            $('#cart_limit').html('Minimum quantity reached in cart of 1 items');
            $('#discount_rate').html('Discounted %');
            $('#order_item').show();
            $('#order_item').html('Entire Order');
            $("#discount_type_buy").prop("checked", false);
            $("#discount_type_percentage").prop("checked", false);
            $("#discount_type_free_shipping").prop("checked", false);
            $("#all_items").prop("checked", true);

        }
    });

    // discount type free shipping- show/hide fields
    $("#discount_type_free_shipping").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $(".discount_value").hide();
            $('.buy-discount-type').hide();
            $('.percentage-discount').show();
            $('#discount_type_fixed').prop("checked", false);
            $('#discount_type_buy').prop("checked", false);;
            $('#discount_type_percentage').prop("checked", false);
            $('.percentage-discount-fixed-shipping').hide();
            $('#specific_order_display_fixed').hide();
            $('#discount_exclude').show();
            $('#discount_type').html('Free Shipping');
            $('#order_item').hide();
            $('#cart_limit').html('Minimum quantity reached in cart of 1 items');
            $('#discount_rate').hide();
            if ($('#activeEndDate').is(':checked')) {
                $('#content_discount').css('margin-top', '-60px');
            } else {
                $('#content_discount').css('margin-top', '-110px');

            }
            $('.discount_applies').hide();

        }
    });

    // discount cart field -check
    $("#discount_cart").click(function() {
        var checked = $(this).is(':checked');

        if (checked) {
            $('#mini_quantity_cart_check_reached').show();
            $("#amount_bool").prop("checked", false);
            $('#mini_amount_cart_check').hide();
        }
    });

    // exclude shipping - show/hide field
    $("#exclude_shipping").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('#exclude_shipping_amt').show();
        } else {
            $('#exclude_shipping_amt').hide();

        }
    });

    // all items - prop set
    $("#all_items").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $("#discount_each_item").prop("checked", false);
        }
    });

    // discount each item - prop set
    $("#discount_each_item").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $("#all_items").prop("checked", false);
        }
    });

    // amount bool - prop set
    $("#amount_bool").click(function() {
        var checked = $(this).is(':checked');

        if (checked) {
            $('#mini_amount_cart_check').show();
            $("#discount_cart").prop("checked", false);
            $('#mini_quantity_cart_check_reached').hide();

        }
    });

    // entire order - prop set ,show/hide
    $("#entire_order").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $("#specific_order").prop("checked", false);
            $('#specific_order_display').hide();
            $('#specific_order_display_fixed').hide();
            $('#order_item').html('Entire Order');
        }
    });

    // specific order - prop set /show/hide
    $("#specific_order").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $("#entire_order").prop("checked", false);
            $('#specific_order_display').show();
            $('#specific_order_display_fixed').hide();
            $('#order_item').html('Specific items');
        }
    });

    // active from date - value check
    $("#active_from_date").on('change', function() {
        let fromdate = $('#active_from_date').val()

        if ($('#active_from_date').val().length != 0) {
            $('#active_date').html('Active from ' + fromdate);
        } else {
            $('#active_date').html('Active from ' + fromdate);
        }
    });

    // active to date - value check
    $("#active_to_date").on('change', function() {
        let fromdate = $('#active_from_date').val()

        if ($('#active_to_date').val().length != 0) {
            let todate = $('#active_to_date').val()
            $('#active_date').html('Active from ' + fromdate + ' to ' + todate);
        } else {
            $('#active_date').html('Active from ' + fromdate + ' to');
        }
    });

    // cart minimum quantity - value change check
    $("#cart_minimum_quantity").on('change', function() {
        let quantity = $('#cart_minimum_quantity').val();
        if ($('#cart_minimum_quantity').val().length != 0) {
            $('#cart_limit').html('Minimum quantity reached in cart of ' + quantity + ' items');
        } else {
            $('#cart_limit').html('Minimum quantity reached in cart of 1 items');
        }
    });

    // cart minimum quantity - value change check
    $("#cart_mini_quantity").on('change', function() {
        let quantity = $('#cart_mini_quantity').val()
        if ($('#cart_mini_quantity').val().length != 0) {
            $('#cart_limit').html('Minimum quantity reached in cart of ' + quantity + ' items');
        } else {
            $('#cart_limit').html('Minimum quantity reached in cart of 1 items');
        }
    });

    // add products button - click modal show
    jQuery(document).on("click", "#add_products", function() {
        jQuery("#productPicker").modal("show");
        $('.check-product').prop("checked", false);
        $('#product_selected').html('0 selected')

    });

    // percentage discount value - change
    $("#percentage_discount_value").on('change', function() {
        let discount = $('#percentage_discount_value').val();
        if (discount.length != 0) {
            $('#discount_rate').html('Discounted ' + discount + '%');
        } else {
            $('#discount_rate').html('Discounted %');
        }
    });

    // customer percentage discount value - change
    $("#customer_percentage_discount").on('change', function() {
        let discount = $('#customer_percentage_discount').val();
        if (discount.length != 0) {
            $('#discount_rate').html('Discounted ' + discount + '%');
        } else {
            $('#discount_rate').html('Discounted %');
        }
    });

    // select all variants- check/uncheck
    $("#selectall-variants").click(function() {
        variant_arr = []
        var checked = $(this).is(':checked');
        if (checked) {
            $('.check-variant').prop("checked", true);
            $('#add_variant').attr('disabled', false);
            $('.check-product').each(function() {
                let id = $(this).attr('id');
                if (id != undefined) {
                    variant_arr.push(id)
                    $('#variant_selected').html(variant_arr.length + ' selected');
                    $('#add_variant').attr('disabled', false);

                }
            })
        } else {
            $('#variant_selected').html('0 selected');
            $('.check-variant').prop("checked", false);
            $('#add_variant').attr('disabled', true);

        }
    });

    // variants- check
    $('.check-variant:checkbox').change(function() {
        let id = $(this).attr('id');
        if ($(this).is(':checked')) {
            $('#add_variant').attr('disabled', false);
            variant_arr.push(id);
            $('#variant_selected').html(variant_arr.length + ' selected');
            $('#add_variant').attr('disabled', false);

        } else {
            variant_arr.splice(1, 1)
            $('#variant_selected').html(variant_arr.length + ' selected');
            if (variant_arr.length == 0) {
                $('#add_variant').attr('disabled', true);

            }
        }

    });

    // add product variants- button
    $("#add_variant").click(function() {
        jQuery('#productVariantPicker').modal('toggle');
        $('.variants').html(variant_arr.length + '/' + variant_arr.length + ' variant selected')
    });

    // select all variants- checked/unchecked
    if ($('#selectall-variants').is(':checked')) {
        $('.check-variant').prop("checked", true);
        $('.check-product').each(function() {
            let id = $(this).attr('id');
            variant_arr.push(id);
            $('#variant_selected').html(variant_arr.length - 1 + ' selected');
            $('#add_variant').attr('disabled', false);

        })

    }

    $("#selectall-collections").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('.check-collection').prop("checked", true);
            $('#add-collection').attr('disabled', false);
            collection_arr = [];
            collection_ids = [];
            $('.check-collection').each(function(index) {
                let id = $(this).attr('id');
                if (id != undefined) {
                    let product_img = $('#' + id + '_img').attr('src');
                    let product_lbl = $('#' + id + '_desc').html();
                    collection_arr.push({
                        id: id,
                        product_img: product_img,
                        product_label: product_lbl
                    });
                    collection_ids.push(id);
                    $('#collection_selected').html(collection_arr.length + ' selected')
                }

            });

        } else {
            collection_arr = [];
            $('.check-collection').prop("checked", false);
            $('#add-collection').attr('disabled', true);
            $('#collection_selected').html(collection_arr.length + ' selected')

        }
    });

    // collections- check/uncheck
    $('.check-collection:checkbox').change(function() {
        let id = $(this).attr('id');
        if ($(this).is(':checked')) {
            $('#add-collection').attr('disabled', false);
            let product_img = $('#' + id + '_img').attr('src');
            let product_lbl = $('#' + id + '_desc').html();
            collection_arr.push({
                id: id,
                product_img: product_img,
                product_label: product_lbl
            });
            collection_ids.push(id);
            $('#collection_selected').html(collection_arr.length + ' selected')

        } else {
            collection_arr.splice($.inArray(id, arr), 1);
            $('#collection_selected').html(collection_arr.length + ' selected')

        }

    });

    // select all products- check/uncheck
    $("#selectall-products").click(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $('.check-product').prop("checked", true);
            $('#add_product').attr('disabled', false);
            arr = [];
            ids = [];
            $('.check-product').each(function(index) {
                let id = $(this).attr('id');
                if (id != undefined) {
                    let product_img = $('#' + id + '_img').attr('src');
                    let product_lbl = $('#' + id + '_desc').html();
                    arr.push({
                        id: id,
                        product_img: product_img,
                        product_label: product_lbl
                    });
                    ids.push(id);
                    $('#product_selected').html(arr.length + ' selected')
                }

            });

        } else {
            arr = [];
            $('.check-product').prop("checked", false);
            $('#add_product').attr('disabled', true);
            $('#product_selected').html(arr.length + ' selected');

        }
    });

    // product- check/uncheck
    $('.check-product:checkbox').change(function() {
        let id = $(this).attr('id');
        if ($(this).is(':checked')) {
            $('#add_product').attr('disabled', false);
            let product_img = $('#' + id + '_img').attr('src');
            let product_lbl = $('#' + id + '_desc').html();
            arr.push({
                id: id,
                product_img: product_img,
                product_label: product_lbl
            });
            ids.push(id);
            $('#product_selected').html(arr.length + ' selected')

        } else {
            arr.splice($.inArray(id, arr), 1);
            $('#product_selected').html(arr.length + ' selected')

        }

    });

    // add product - button and display products
    $('#add_product').click(function() {
        if (arr.length > 0) {
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                let html = `<div class="container">
             <div class="row" id="product${element.id}" name="product_ids[${element.id}]" >
             <div class="col-md-2"><img src="${element.product_img}" width="70" height="50" class="w-full h-full object-contain"></div>
             <div class="col-md-6">${element.product_label}
             <p class="variants"> 3/3 variant selected</p>
             </div>
             <div class="col-md-2 edit-variants">Edit Variants</div>
             <div class="col-md-2"><i id="${element.id}" type="button" class="bi bi-trash delete-product"></i> </div>
           </div>
         </div><br>`;
                $('#product-list').append(html);

            }
        }
        jQuery('#productPicker').modal('toggle');
    });

    // delete product 
    jQuery(document).on("click", ".delete-product", function() {
        let id = jQuery(this).attr('id');
        jQuery('#product' + id).remove();
    });

    // edit variant modal -show
    jQuery(document).on("click", ".edit-variants", function() {
        let id = jQuery(this).attr('id');
        jQuery('#productVariantPicker').modal("show");
    });

    //add collection modal - show
    jQuery(document).on("click", "#add_collection", function() {
        jQuery('#productCollectiontPicker').modal("show");
        collection_arr = [];

    });

    // navigate to discount add page - table list item click
    jQuery(document).on("click", ".table-row", function() {
        let id = jQuery(this).attr('id');
        let store_id = jQuery(this).attr("store_id");

        window.location.href = `${ajax_url}/${store_id}/add-discount`;
    });

    // add-edit discount
    jQuery("#automatic_discount").validate({
        errorPlacement: function(error, element) {
            if (element.attr("type") == "checkbox") {
                element.parent().append(error);
            } else {
                element.parent().append(error);
            }
        },
        submitHandler: function(form) {
            let formData = new FormData(form);
            formData.append('product_ids[]', ids)
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: false,
                processData: false,
                data: formData,
                url: `${ajax_url}/add-discount`,
                mimeType: "multipart/form-data",
                success: function(response) {
                    if (response?.status) {

                        jQuery.notify({
                            message: response.message
                        }, {
                            type: "success"
                        });
                        setTimeout(function() {
                            window.location.href = response?.redirect_url;
                        }, 1500);

                    } else {
                        jQuery.notify({
                            message: response.message
                        }, {
                            type: "danger"
                        });
                    }
                },
            });
        },
    });

    // delete discount
    jQuery(".delete_discount").click(function() {
        let discount_id = this.id;
        let store_id = jQuery(this).attr("store_id");

        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this discount again!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                jQuery.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    contentType: 'application/json',
                    processData: false,
                    data: JSON.stringify({
                        store_id: store_id,
                        id: discount_id,
                    }),
                    url: `${ajax_url}/delete-discount`,
                    success: function(response) {
                        if (response?.status) {
                            jQuery.notify({
                                message: response.message
                            }, {
                                type: "success"
                            });
                            setTimeout(function() {
                                window.location.href = response?.redirect_url;
                            }, 1500);
                        } else {
                            jQuery.notify({
                                message: response.message
                            }, {
                                type: "danger"
                            });
                        }
                    },
                });
            } else {
                swal("Your Automatic Discount is safe!");
            }
        });
    });

});