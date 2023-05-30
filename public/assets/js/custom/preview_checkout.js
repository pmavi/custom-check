jQuery(document).ready(function () {
    let timer ;
    let fontSize = $('#font_size').val();
    if(fontSize!= "" || fontSize!= null || fontSize != undefined){
        $('.main-data').css("font-size", parseInt(fontSize)+'px');
    }
    if($('#lang-btn').val() != undefined){
     timer = setInterval(checkScriptExists,
       1000);
       setTimeout(function(){ translateLanguage(this.value)},1000)
    }
 
    function checkScriptExists(){
      var google_script_url = "https://translate.google.com/translate_a/element.js";	 
      if($("script[src*='"+google_script_url+"']")[0]){
          // run google translate function
          new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: true}, 'google_translate_element');
          clearInterval(timer);
          return;
      } 
    }    
    function translateLanguage(lang) {
        checkScriptExists();
        var frame = $('.goog-te-menu-frame:first');
        if( frame.contents().find('.goog-te-menu2-item span.text:contains(' + lang + ')').get(0)!=undefined)
        {frame.contents().find('.goog-te-menu2-item span.text:contains(' + lang + ')').get(0).click();
         } return false;
    }
    
jQuery('input').bind('focus', function(e){
  let id =  $("input[name="+this.name+"]").attr('id')
  if($("input[name="+this.name+"]").val().length === 0){
    $("input[name="+this.name+"]").css('border-color' , id)
  }
})

$("input").focusout(function(e) { 
    let myclass =  $("input[name="+this.name+"]").attr('class');
    let id =  $("input[name="+this.name+"]").attr('id')

    if($("input[name="+this.name+"]").val().length === 0){
        $("input[name="+this.name+"]").css('border-color' , myclass);
        $('p'+id).css('display' ,'block');
    }
}) ;

jQuery('input').on('change', function(e){
    let myclass =  $("input[name="+this.name+"]").attr('class');
    let id =  $("input[name="+this.name+"]").attr('id')

    if($("input[name="+this.name+"]").val().length === 0){
        $("input[name="+this.name+"]").css('border-color' , myclass);
        $('p'+id).css('display' ,'block');

    }
    else{
        $("input[name="+this.name+"]").css('border-color' , '#c7c7c7') ;
        $('p'+id).css('display' ,'none');
    }
})
jQuery('#billing-checkbox').on('change', function(e){
    let isChecked = $('#billing-checkbox')[0].checked;
    if(!isChecked){
        $('#billing-details').css('display','block')
    }
    else{
        $('#billing-details').css('display','none')
    }
});

jQuery('input[name="payment_method"]').change(function(){ // bind a function to the change event
        if( jQuery(this).is(":checked") ){ // check if the radio is checked
            var val = jQuery(this).val(); // retrieve the value
            if(val == "Stripe"){
                jQuery('.credit_card').show("slow");
            }else{
                jQuery('.credit_card').hide("slow")

            }
        }
    });
 });

 $(".credit_card input[type=text]").on("keyup",function () {
    cardFormValidate();
});

function cardFormValidate() {
    var cardValid = 0;
    //card number validation
    $("#card_number").validateCreditCard(function (result) {
        if (result.valid) {
            $("#card_number").removeClass("requiredBorder");
            cardValid = 1;
        } else {
            console.log("enter validation")
            $("#card_number").addClass("requiredBorder");
            cardValid = 0;
        }
    });

    //card details validation
    var expMonth = $("#expiry_month").val();
    var expYear = $("#expiry_year").val();
    var cvv = $("#cvv").val();
    var regMonth = /01|02|03|04|05|06|07|08|09|10|11|12/gi;
    var regYear = /^2023|2024|2025|2026|2027|2028|2029|2030|2031$/;
    var regCVV = /^[0-9]{3,3}$/;
    // /_createdDate|_createdTime|user_name|bid_name|APP_URL|APP_BUILD_URL|bidhq_view_link|bid_due_date|user_icon|client_name/gi,
    if (cardValid == 0) {
        $("#card_number").addClass("requiredBorder");
        $("#card_number").focus();
        $(".make_payment").prop("disabled", true);
        return false;
    } else if (!regMonth.test(expMonth)) {
        console.log(regMonth.test(expMonth))
        $("#card_number").removeClass("requiredBorder");
        $("#expiry_month").addClass("requiredBorder");
        $("#expiry_month").focus();
        $(".make_payment").prop("disabled", true);
        return false;
    } else if (!regYear.test(expYear)) {
        $("#card_number").removeClass("requiredBorder");
        $("#expiry_month").removeClass("requiredBorder");
        $("#expiry_year").addClass("requiredBorder");
        $("#expiry_year").focus();
        $(".make_payment").prop("disabled", true);
        return false;
    } else if (!regCVV.test(cvv)) {
        $("#card_number").removeClass("requiredBorder");
        $("#expiry_month").removeClass("requiredBorder");
        $("#expiry_year").removeClass("requiredBorder");
        $("#cvv").addClass("requiredBorder");
        $("#cvv").focus();
        $(".make_payment").prop("disabled", true);
        return false;
    } else {
        $("#card_number").removeClass("requiredBorder");
        $("#expiry_month").removeClass("requiredBorder");
        $("#expiry_year").removeClass("requiredBorder");
        $("#cvv").removeClass("requiredBorder");
        if ($(".payment_gateway").is(":checked") && $(".payment_gateway").val() == "stripe") $(".make_payment").prop("disabled", false);
        return true;
    }
}