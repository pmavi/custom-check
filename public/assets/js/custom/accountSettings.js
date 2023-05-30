jQuery(document).ready(function () {

    jQuery("#blah").click(function () {
        jQuery("input[id='avatar']").click();
        jQuery("#avatar").change(function () {
            console.log("hiiii");
            jQuery("#avatar_upload_btn").show();
            readIMG(this);
        });
    });

    jQuery("#edit_profile").validate({
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
                url: `${ajax_url}/accountSettings`,
                mimeType: "multipart/form-data",
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
        },
    });

    jQuery("#edit_password").validate({
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
                url: `${ajax_url}/changePassword`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () { window.location.href = response?.redirect_url; }, 1500);
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                    }
                },
            });
        },
    });

    jQuery("#avatar_upload_btn").click(function () {
        const user_id = jQuery('#user_id').val();
        const fd = new FormData();
        const files = jQuery('#avatar')[0].files;
        fd.append('file', files[0]);
        fd.append('user_id', user_id);
        jQuery.ajax({
            type: "POST",
            cache: false,
            dataType: "json",
            contentType: false,
            processData: false,
            data: fd,
            url: `${ajax_url}/change-avatar`,
            mimeType: "multipart/form-data",
            success: function (response) {
                if (response?.status) {
                    jQuery.notify({ message: response.message }, { type: "success" });
                    setTimeout(function () { window.location.reload(); }, 1500);

                } else {
                    jQuery.notify({ message: response.message }, { type: "danger" });
                }
            },
        });

    })
    jQuery("#avatar_delete_btn").click(function () {
        const user_id = jQuery('#user_id').val();
        jQuery.ajax({
            type: "DELETE",
            cache: false,
            dataType: "json",
            contentType: false,
            processData: false,
            data: JSON.stringify({
                user_id: user_id,
            }),
            url: `${ajax_url}/delete-avatar`,
            contentType: "application/json",
            success: function (response) {
                if (response?.status) {
                    jQuery.notify({ message: response.message }, { type: "success" });
                    setTimeout(function () { window.location.reload(); }, 1500);
                } else {
                    jQuery.notify({ message: response.message }, { type: "danger" });
                }
            },
        });

    })
});

function readIMG(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            jQuery('#blah').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}