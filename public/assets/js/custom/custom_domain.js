jQuery(document).ready(function () {

    if($('#cdomain_id').val() == "null"){
        $('.domain-listing').css('display','none');
        $('.add-domain').css('display','block');
    }
    else{
        $('.domain-listing').css('display','block');
        $('.add-domain').css('display','none');
        
    }
   
    jQuery("#connect_domain").validate({
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
                url: `${ajax_url}/custom-domain`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    console.log("----------------------response:", response);
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
    
    jQuery("#verify_domain").validate({
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
                url: `${ajax_url}/add-custom-domain`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    console.log("----------------response:" , response);
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

    jQuery(".delete_domain").click(function(){    
        let domain_id = this.id;
        let store_id = $('#store_id').val();
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this domain again!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                jQuery.ajax({
                    type: "POST",
                    cache: false,
                    dataType: "json",
                    contentType: 'application/json',
                    processData: false,
                    url: `${ajax_url}/delete-custom-domain`,
                    data:JSON.stringify({id:domain_id,store_id:store_id}),
                    success: function (response) {
                        console.log("-------------------response:", response);
                        if (response?.status) {
                            swal("Your domain has been deleted!", {
                                icon: "success",
                              });
                            setTimeout(function () { 
                                window.location.href = response?.redirect_url;                            }, 1500);
                        } else {
                            swal(response.message);
                        }
                    },
                });
              
            } else {
              swal("Your Domain is safe!");
            }
          });
          
        });

        $('#copy-domain-point').click(function() {
            $('#points_to_domain').select();
            document.execCommand('copy');
            $('#points_to_domain').mouseup(function () {
                $('#points_to_domain').unbind("mouseup");
                return false;
            });
        })

        $('#copy-domain-host').click(function() {
            $('#domain_hostname').select();
            document.execCommand('copy');
            $('#domain_hostname').mouseup(function () {
                $('#domain_hostname').unbind("mouseup");
                return false;
            });
        })
      
});