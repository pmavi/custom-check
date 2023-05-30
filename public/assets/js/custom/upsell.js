jQuery(document).ready(function () {
    var selected_products = [];
    var firstUpsell = [];
    var secondUpsell = [];
    var thirdUpsell = [];
  
    //   $("#add_product_for_offer_1").prop("disabled", "true");
    $("#add_product_for_offer_2").prop("disabled", "true");
    $("#add_product_for_offer_3").prop("disabled", "true");
    $("#create-upsell").prop("disabled", "true");
  
    // Add Product List in Modal
    var data = $("#products").val();
  
    const products = JSON.parse(data);
  
    if (products) {
      console.log(products, "products");
      products.products.forEach((element, index) => {
        // main Product Body
        $(".products-body").append(
          `<div class="flex items-center p-4 cursor-pointer space-x-5" id="product-body-${element.id}"><input type="checkbox" value="${element.id}"/><img class="object-contain object-center w-12 h-12 border rounded-lg border-black-400" src="${element.image.src}"/><span class="text-xs">${element.title}</span></div>`
        );
  
        // Upsell Product Body 1
        $(".products-body1").append(
          `<div class="flex items-center p-4 cursor-pointer space-x-5" id="1stupsell-product-${element.id}"><input type="radio" name="upsell-product1" value="${element.id}"/><img class="object-contain object-center w-12 h-12 border rounded-lg border-black-400" src="${element.image.src}"/><span class="text-xs">${element.title}</span></div>`
        );
  
        // Upsell Product Body 2
        $(".products-body2").append(
          `<div class="flex items-center p-4 cursor-pointer space-x-5" id="2ndupsell-product-${element.id}"><input  type="radio" name="upsell-product2" value="${element.id}"/><img class="object-contain object-center w-12 h-12 border rounded-lg border-black-400" src="${element.image.src}"/><span class="text-xs">${element.title}</span></div>`
        );
  
        // Upsell Product Body 3
        $(".products-body3").append(
          `<div class="flex items-center p-4 cursor-pointer space-x-5" id="3rdupsell-product-${element.id}"><input type="radio" name="upsell-product3" value="${element.id}"/><img class="object-contain object-center w-12 h-12 border rounded-lg border-black-400" src="${element.image.src}"/><span class="text-xs">${element.title}</span></div>`
        );
      });
    }
  
    // Add Checked products
    $("#add_product").click(function () {
      console.log("click add product");
      $(".products-body input:checked").each(function (index, element) {
        if (!selected_products.includes(element.value)) {
          selected_products.push(element.value);
        }
      });
  
      selected_products.forEach(function (selectedElement) {
        RemoveSelectedELement(selectedElement);
        const found = products.products.find(
          (element) => element.id == selectedElement
        );
        console.log("found", found)
        found &&
          $(".selected-products").append(
            `<div class="flex items-center p-4 cursor-pointer space-x-5"><img class="object-contain object-center w-12 h-12 border rounded-lg border-black-400" src="${found.image.src}"/><span class="text-xs">${found.title}</span></div>`
          );
        console.log(found, "foundddddddd");
      });
  
      jQuery("#addproductModal").modal("hide");
      selected_products = [];
    });
  
    // Add first Upsell product
    $("#add_products-upsell1").click(function () {
      console.log("click add product");
      $(".products-body1 input:checked").each(function (index, element) {
        if (!firstUpsell.includes(element.value)) {
          firstUpsell.push(element.value);
        }
      });
  
      firstUpsell.forEach(function (selectedElement) {
        RemoveSelectedELement(selectedElement);
        const found = products.products.find(
          (element) => element.id == selectedElement
        );
        if (found) {
          $("#add_product_for_offer_1").remove();
          $(".1stUpsell").append(
            `<div class="flex items-center p-4 cursor-pointer space-x-5"><img class="object-contain object-center w-12 h-12 border rounded-lg border-black-400" src="${found.image.src}"/><span class="text-xs">${found.title}</span></div>`
          );
        }
      });
  
      jQuery("#addproductforoffer1").modal("hide");
  
      $("#add_product_for_offer_2").prop("disabled", null);
      $("#create-upsell").prop("disabled", null);
  
    });
  
    // Add second Upsell product
    $("#add_products-upsell2").click(function () {
      console.log("click add product");
      $(".products-body2 input:checked").each(function (index, element) {
        if (!secondUpsell.includes(element.value)) {
          secondUpsell.push(element.value);
        }
      });
  
      secondUpsell.forEach(function (selectedElement) {
        RemoveSelectedELement(selectedElement);
        const found = products.products.find(
          (element) => element.id == selectedElement
        );
        if (found) {
          $("#add_product_for_offer_2").remove();
          $(".2ndUpsell").append(
            `<div class="flex items-center p-4 cursor-pointer space-x-5"><img class="object-contain object-center w-12 h-12 border rounded-lg border-black-400" src="${found.image.src}"/><span class="text-xs">${found.title}</span></div>`
          );
        }
      });
  
      jQuery("#addproductforoffer2").modal("hide");
      $("#add_product_for_offer_3").prop("disabled", null);
    });
  
    // Add third Upsell product
    $("#add_products-upsell3").click(function () {
      console.log("click add product");
      $(".products-body3 input:checked").each(function (index, element) {
        if (!thirdUpsell.includes(element.value)) {
          thirdUpsell.push(element.value);
        }
      });
  
      thirdUpsell.forEach(function (selectedElement) {
        RemoveSelectedELement(selectedElement);
        const found = products.products.find(
          (element) => element.id == selectedElement
        );
        if (found) {
          $("#add_product_for_offer_3").remove();
          $(".3rdUpsell").append(
            `<div class="flex items-center p-4 cursor-pointer space-x-5"><img class="object-contain object-center w-12 h-12 border rounded-lg border-black-400" src="${found.image.src}"/><span class="text-xs">${found.title}</span></div>`
          );
        }
      });
  
      jQuery("#addproductforoffer3").modal("hide");
    });
  
  });
  
  function firstUpsell() {}
  function SecondUpsell() {}
  function thirdUpsell() {}
  
  function RemoveSelectedELement(productId) {
    $("#product-body-" + productId).remove();
    $("#1stupsell-product-" + productId).remove();
    $("#2ndupsell-product-" + productId).remove();
    $("#3rdupsell-product-" + productId).remove();
  }
  