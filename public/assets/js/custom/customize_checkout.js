jQuery(document).ready(function () {

    jQuery(document).on("click", "#add_section", function () {
        let section_count = jQuery(this).attr("section_count");
        section_count = parseInt(section_count) + 1;

        let section_html = `
            <div class="accordion-item" id="section${section_count}">
                        <h2 class="accordion-header" id="heading_${section_count}">
                    <button
                        class="accordion-button collapsed"
                        type="button"
                        myattr="${section_count}"
                    ><img class="img img-thumbnail" src="/assets/img/avatar.png" style="max-width: 50px;margin-right: 5px;"> New About section #${section_count}
                    <i id="delete_section${section_count}" type="button" class="bi bi-trash accordion-trash" ></i> 
                    </button>
                </h2>
                <div
                    id="collapse_${section_count}"
                    class="accordion-collapse collapse show"
                    aria-labelledby="heading_${section_count}" data-bs-parent="#section_accordion" style="display: block;">            
                    <div class="accordion-body row">
                        <div class="col-md-12">
                            <input
                                class="form-control required"
                                name="section_title[${section_count}]"
                                placeholder="Section Title"
                            />
                        </div>
                        <div class="col-md-12">
                        <br>
                            <input
                                type="url"
                                class="form-control required"
                                name="section_icon[${section_count}]"
                                placeholder="Section Icon(image url)"
                            />
                        </div>
                        <div class="col-md-12">
                        <br>
                            <textarea
                                class="form-control required"
                                name="section_description[${section_count}]"
                                rows="5" placeholder="Section Text"
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        `;

        jQuery(".checkout_sections").append(section_html);
        jQuery(this).attr("section_count", section_count);

        jQuery(document).on("click", "#delete_section" + section_count, function () {
            jQuery(this).parents("#section" + section_count).remove();
        })
    });
    var buttonclicked = false;

    $('#preview-checkout').click(function() {
        if(!buttonclicked){
            buttonclicked = true;
        }
    });
    jQuery("#customize_checkout_form").validate({
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
                url: `${ajax_url}/customize-checkout`,
                mimeType: "multipart/form-data",
                success: function (response) {
                    if (response?.status) {
                        jQuery.notify({ message: response.message }, { type: "success" });
                        setTimeout(function () {
                            if(buttonclicked == true){
                                window.location.href = `${ajax_url}/${response.store_id}/preview-checkout`
                            }
                            else{
                                window.location.href = response?.redirect_url;
                            }
                           
                        }, 1500);
                    } else {
                        jQuery.notify({ message: response.message }, { type: "danger" });
                    }
                },
            });
        },
    });

    jQuery(".accordion-trash").click(function () {
        let section_id = this.id;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this section again!",
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
                        "id": section_id,
                    }),
                    url: `${ajax_url}/checkout-delete-section`,
                    success: function (response) {
                        if (response?.status) {
                            jQuery.notify({ message: response.message }, { type: "success" });
                            setTimeout(function () {
                               // window.location.href = response?.redirect_url;
                               window.location.reload()
                            }, 1500);
                        } else {
                            jQuery.notify({ message: response.message }, { type: "danger" });
                        }
                    },
                });
            } else {
                swal("Your section is safe!");
            }
        });
    });
    $("#font_size" ).keyup(function() {
        if($('#font_size').val()< 11 || $('#font_size').val()> 30 ){
            $('#errorMsg').show();
        }
        else{
          $('#errorMsg').hide();
        }
      });
    // $(".accordion-button").click(function() {
    $("body").delegate(".accordion-button", "click", function(){
        let indexvalue = $(this).attr("myattr");
        let accId = "#collapse_"+indexvalue;
        if($(accId).attr("style")=="display: block;"){
            $(this).removeClass('collapsed');
        }else{
            $(this).addClass('collapsed');
        }
        $(accId).toggle('slow');
        
    });
});