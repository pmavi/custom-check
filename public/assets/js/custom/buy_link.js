jQuery(document).ready(function () {
    let arr = [];
    let ids = [];

    $('input:checkbox').change(function () {
        let id = $(this).attr('id');
        if ($(this).is(':checked')) {
            let product_img = $('#' + id + '_img').attr('src');
            let product_lbl = $('#' + id + '_lbl').html();
            arr.push({ id: id, product_img: product_img, product_label: product_lbl });
            ids.push(id);
        } else {
            arr.splice($.inArray(id, arr), 1);
        }

    });

    $('#add-product-btn').click(function () {
        if (arr.length > 0) {
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                let html = `
                    <div class ="row" id="${element.id}">
                        <div class="col-sm-1"><img src="${element.product_img}" width="50" height="50"> </div>
                        <div class="col-xl-2">${element.product_label}</div>
                        <div class="col-xl-3">1 pour 199.5 </div>
                        <div class="col-xl-3">Quantity 1 </div>
                        <div class="col-xl-2"> <i id="delete_section${element.id}" type="button" class="bi bi-trash " ></i>  </div>
                    </div>
                `;
                $('#products-list').append(html);
            }
            jQuery('#productsPicker').modal('toggle');
            let store_id = $('#store_id').val();
            let data = moment().unix() + '-' + store_id;
            var encodedString = btoa(data);
            jQuery('#buylink-url').val(`${ajax_url}/buy-link-product/${encodedString}`);
        }

        //add to db and copy link
        $('.copy-buy-link').click(function () {
            let buy_link = jQuery('#buylink-url').val();
            let buy_link_token = buy_link.substring(buy_link.lastIndexOf('/') + 1);
            let product_ids = [];
            $.each(ids, function (i, e) {
                if ($.inArray(e, product_ids) == -1) product_ids.push(e);
                return product_ids;
            });

            let store_id = $('#store_id').val();
            jQuery.ajax({
                type: "POST",
                cache: false,
                dataType: "json",
                contentType: 'application/json',
                processData: false,
                url: `${ajax_url}/buy-link`,
                data: JSON.stringify({
                    buy_link_token: buy_link_token,
                    product_ids: product_ids,
                    store_id: store_id
                }),
                success: function (response) {
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () {
                            $('#buylink-url').select();
                            document.execCommand('copy');
                            $('#buylink-url').mouseup(function () {
                                $('#buylink-url').unbind("mouseup");
                                return false;
                            });
                        }, 1000);
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                    }
                },
            });
        })
    });
});