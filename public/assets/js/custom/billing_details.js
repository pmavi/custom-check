let newYear = new Date().getFullYear().toString().substr(-2);
let regYearNew = newYear;
for (let i = 1; i <= 7; i++) {
  regYearNew = regYearNew + "|" + parseInt(parseInt(newYear) + parseInt(i));
}
// regYearNew = new RegExp(regYearNew, 'gi');
regYearNew = new RegExp(`^${regYearNew}$`);
function cardFormValidate() {
  var cardValid = 0;
  //card number validation
  $("#card_number").validateCreditCard(function (result) {
    if (result.valid) {
      $("#card_number").removeClass("requiredBorder");
      cardValid = 1;
    } else {
      $("#card_number").addClass("requiredBorder");
      cardValid = 0;
    }
  });

  //card details validation
  // var cardName = $("#name_on_card").val();
  var expMonth = $("#expiry_date_id").val().substring(0, 2);
  var expYear = $("#expiry_date_id").val().substring(3, 5);
  var cvv = $("#cvv_id").val();
  // var regName = /^[a-z ,.'-]+$/i;
  var regMonth = /^01|02|03|04|05|06|07|08|09|10|11|12$/;
  var regYear = /^23|24|25|26|27|28|29$/;
  // var regYear = regYearNew;
  var regCVV = /^[0-9]{3,3}$/;
  if (cardValid == 0) {
    $("#card_number").addClass("requiredBorder");
    // $("#card_number").focus();
    $("#submitBilling").attr("disabled", "disabled");
    return false;
  } else if (!regMonth.test(expMonth)) {
    $("#card_number").removeClass("requiredBorder");
    $("#expiry_date_id").addClass("requiredBorder");
    // $("#expiry_date_id").focus();
    $("#submitBilling").attr("disabled", "disabled");
    return false;
  } else if (!regYearNew.test(expYear)) {
    $("#card_number").removeClass("requiredBorder");
    // $("#expiry_date_id").removeClass('requiredBorder');
    $("#expiry_date_id").addClass("requiredBorder");
    // $("#expiry_date_id").focus();
    $("#submitBilling").attr("disabled", "disabled");
    return false;
  } else if (!regCVV.test(cvv)) {
    $("#card_number").removeClass("requiredBorder");
    $("#expiry_date_id").removeClass("requiredBorder");
    $("#cvv_id").addClass("requiredBorder");
    // $("#cvv").focus();
    $("#submitBilling").attr("disabled", "disabled");
    return false;
  } else {
    $("#card_number").removeClass("requiredBorder");
    $("#expiry_date_id").removeClass("requiredBorder");
    $("#cvv_id").removeClass("requiredBorder");
    // $("#name_on_card").removeClass('requiredBorder');
    //update expiry_date_id
    // $("#expiry_date_id").val(`${expMonth}/${expYear}`);
    $("#submitBilling").removeAttr("disabled");
    return true;
  }
}
$(document).ready(function () {
  //card validation on input fields
  $("#billing_form input[type=text]").on("keyup", function () {
    cardFormValidate();
  });
  //card validation on input fields
  $("#isCompanyId").on("change", function () {
    if($("#isCompanyId").prop('checked') == true){
      $("#billing_form input[name=billing_company]").val("");
      $("#billing_form input[name=billing_company]").removeClass("required");
      $("#billing_form input[name=billing_company]").attr("readonly", true);
    }else{
      $("#billing_form input[name=billing_company]").addClass("required");
      $("#billing_form input[name=billing_company]").removeAttr("readonly");
    }
  });

  jQuery("#billing_form").validate({
    errorPlacement: function (error, element) {
      if (element.attr("type") == "checkbox" || element.attr("type") == "radio") {
        element.parent().parent().parent().append(error);
      } else {
        element.parent().append(error);
      }
    },
    submitHandler: function (form) {
      $("#submitBilling").hide();
      $("#loading_button").show();
      jQuery.ajax({
        type: "POST",
        cache: false,
        dataType: "json",
        contentType: false,
        processData: false,
        data: new FormData(form),
        url: `${ajax_url}/billing-detail`,
        mimeType: "multipart/form-data",
        success: function (response) {
          if (response?.status) {
              jQuery.notify({ message: response.message }, { type: "success" });
              setTimeout(function () {
                  window.location.href = response?.redirect_url;
              }, 1500);
              $("#submitBilling").show();
              $("#submitBilling").attr("disabled", "disabled");
              $("#loading_button").hide();
              $("#billing_form input").attr("disabled", "disabled");
          } else {
              jQuery.notify({ message: response.message }, { type: "danger" });
              $("#submitBilling").show();
              $("#loading_button").hide();
          }
        },
      });
    },
  });

  $("#billing_form input[type=text]").on("change", function () {
    $(this).val($.trim($(this).val()));
  });

  $("input[name=card_id]").on("change", function () {
    if($(this).val()=="new_card"){
      $("#collapseCC").show('slow');
      $("#submitBilling").attr("disabled", "disabled");
    }else{
      $("#collapseCC").hide('slow');
      $("#submitBilling").removeAttr("disabled");
    }
  });

  if($("input[name=card_id]").is(':checked')){
    if($(this).val()=="new_card"){
      $("#submitBilling").attr("disabled", "disabled");
    }else{
      $("#submitBilling").removeAttr("disabled");
    }
  }

});

function isNumber(evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

// function modifyInput(ele) {
//     if (ele.value.length === 2){
//       ele.value = ele.value + '/'
//     }else{
//       if (ele.value.length === 3 && ele.value.charAt(2) === '/'){
//         ele.value = ele.value.replace('/', '');
//       }
//     }
//   }

function formatString(event) {
  var inputChar = String.fromCharCode(event.keyCode);
  var code = event.keyCode;
  var allowedKeys = [8];
  if (allowedKeys.indexOf(code) !== -1) {
    return;
  }

  event.target.value = event.target.value
    .replace(
      /^([1-9]\/|[2-9])$/g,
      "0$1/" // 3 > 03/
    )
    .replace(
      /^(0[1-9]|1[0-2])$/g,
      "$1/" // 11 > 11/
    )
    .replace(
      /^([0-1])([3-9])$/g,
      "0$1/$2" // 13 > 01/3
    )
    .replace(
      /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
      "$1/$2" // 141 > 01/41
    )
    .replace(
      /^([0]+)\/|[0]+$/g,
      "0" // 0/ > 0 and 00 > 0
    )
    .replace(
      /[^\d\/]|^[\/]*$/g,
      "" // To allow only digits and `/`
    )
    .replace(
      /\/\//g,
      "/" // Prevent entering more than 1 `/`
    );
}

$(document).ready(function($) {
  $(".table-row").click(function() {
      window.document.location = $(this).data("href");
  });

});
  
function printDiv(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    // printContents.document.write('<style type="text/css">.hide_print{display:none;}</style>')
    var originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents+'<style type="text/css">.hide_print{display:none;}</style>';

    window.print();
    document.body.innerHTML = printContents+'<style type="text/css">.hide_print{display:block;}</style>';
    document.body.innerHTML = originalContents;
}