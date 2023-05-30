jQuery(document).ready(function () {
    jQuery(".bootstrap_datatable").DataTable({
        info: false,
        paging: false,
        searching: false,
    });

    jQuery(document).on("click", "#addProducts", function () {
        jQuery("#productsPicker").modal("show");
    });

    jQuery(document).on("click", "#edit_counteries", function () {
        jQuery("#contriesPicker").modal("show");
    });

    jQuery(document).on("click", "#add_product_button", function () {
        jQuery("#addproductModal").modal("show");
    });

    jQuery(document).on("click", "#add_category_button", function () {
        jQuery("#addcategoryModal").modal("show");
    });

    jQuery(document).on("click", "#add_product_for_offer_1", function () {
        jQuery("#addproductforoffer1").modal("show");
    });

    jQuery(document).on("click", "#add_product_for_offer_2", function () {
        jQuery("#addproductforoffer2").modal("show");
    });

    jQuery(document).on("click", "#add_product_for_offer_3", function () {
        jQuery("#addproductforoffer3").modal("show");
    });

  jQuery(document).on("click", "#add_product_for_offer_3", function () {
    jQuery("#addproductforoffer3").modal("show");
  });

  
})
    jQuery(".publish_button").click(function () {
        var store_id = $("#storeId").val();
        fetch(`${window.location.origin}/${store_id}/get-shop-token`)
            .then((result) => {
                return result.json();
            })
            .then(async (response) => {
                console.log("publish_button response -------------", response);
                jQuery.notify({ message: response.message }, { type: "success" });
            });
    });


function changeStore(value) {
    console.log("value", JSON.parse(value));
    jQuery.ajax({
        type: "POST",
        dataType: "json",
        data: JSON.parse(value),
        url: `${ajax_url}/change-default-store`,
        success: function (response) {
            console.log("response", response);
            if (response.status) {
                window.location.href = response.redirect_url;
            }
        },
    });
}