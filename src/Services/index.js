let express = require("express");
const multer = require("multer");

const router = express.Router();
const AuthorizeMiddleware = require("../middleware/authorize");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads");
    },
    filename: function (req, file, cb) {
        const split_mime = file.mimetype.split("/");
        const extension = typeof split_mime[1] !== "undefined" ? split_mime[1] : "jpeg";
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({
    storage: storage,
});

/*** Application Controllers ***/
const AuthController = require("./Controllers/AuthController");
const DashboardController = require("./Controllers/DashboardController");
const AccountSettingsController = require("./Controllers/AccountSettingsController");
const BillingController = require("./Controllers/BillingController");
const CustomizeCheckoutController = require("./Controllers/CustomizeCheckoutController");
const ShippingRateController = require("./Controllers/ShippingRateController");
const PaymentMethodsController = require("./Controllers/PaymentMethodsController");
const TranslationController = require("./Controllers/TranslationController");
const TaxesController = require("./Controllers/TaxesController");
const BuyLinkController = require("./Controllers/BuyLinkController");
const UpsellController = require("./Controllers/UpsellController");
const StripeWebhook = require("./Controllers/StripeWebhook");
const InvoicesController = require("./Controllers/InvoicesController");
const TestController = require("./Controllers/TestController");
const AutomaticDiscountController = require("./Controllers/AutomaticDiscountController");
const CustomDomainController = require("./Controllers/CustomDomainController");


/*** Admin  Controllers ***/
const AdminSubscriptionController = require("./Controllers/Admin/AdminSubscriptionController");

/*** Shopify Controllers ***/
const ShopifyStoreController = require("./Controllers/Shopify/ShopifyStoreController");
const ShopifyStripeController = require("./Controllers/Shopify/ShopifyStripeController");
const ShopifyPaypalController = require("./Controllers/Shopify/ShopifyPaypalController");

/************************** Order Controller **************************/
const OrderController = require("./Controllers/OrdersController");


/************************** Checkout Controller */
const CheckoutController = require("./Controllers/CheckoutController")

router.get("/", AuthorizeMiddleware.frontend_authorize, AuthController.login);
router.get("/login", AuthorizeMiddleware.frontend_authorize, AuthController.login);
router.post("/login", upload.none(), AuthController.login);

router.get("/register", AuthorizeMiddleware.frontend_authorize, AuthController.Register);
router.post("/register", upload.none(), AuthController.Register);

router.get("/logout", AuthController.logout);

router.get("/forgotPassword", AuthorizeMiddleware.frontend_authorize, AuthController.ForgotPassword);
router.post("/forgotPassword", upload.none(), AuthController.ForgotPassword);

router.get("/resetPassword", AuthorizeMiddleware.frontend_authorize, AuthController.ResetPassword);
router.post("/resetPassword", upload.none(), AuthController.ResetPassword);

// Account Setup Routers
router.get("/accountSettings", AuthorizeMiddleware.wed_authorize, AccountSettingsController.AccountSettings);
router.get("/accountSetting/:store_id", AuthorizeMiddleware.wed_authorize, AccountSettingsController.AccountSettingsStore);
router.post("/accountSettings", upload.none(), AuthorizeMiddleware.wed_authorize, AccountSettingsController.AccountSettings);
router.post("/change-avatar", upload.single('file'), AuthorizeMiddleware.wed_authorize, AccountSettingsController.ChangeAvatar);
router.delete("/delete-avatar", upload.none(), AuthorizeMiddleware.wed_authorize, AccountSettingsController.DeleteAvatar);
router.post("/changePassword",upload.none(), AuthorizeMiddleware.wed_authorize, AccountSettingsController.ChangePassword);

// Billing Routers
router.get(
    "/:store_id/billing-details",
    AuthorizeMiddleware.wed_authorize,
    AuthorizeMiddleware.checksubscription,
    BillingController.billing_details
);
router.post("/billing-detail", upload.none(), AuthorizeMiddleware.wed_authorize, BillingController.billing_details);

//Invoices Routers
// router.get("/:store_id/invoice-list", AuthorizeMiddleware.wed_authorize, InvoiceController.invoice_listing);
// router.get("/:store_id/invoice-details", AuthorizeMiddleware.wed_authorize, InvoiceController.invoice_details);
router.get(
    "/:store_id/invoice-details",
    AuthorizeMiddleware.wed_authorize,
    AuthorizeMiddleware.checksubscription,
    InvoicesController.invoice_listing
);
router.get(
    "/:store_id/invoice-details/:invoice_id/",
    AuthorizeMiddleware.wed_authorize,
    AuthorizeMiddleware.checksubscription,
    InvoicesController.invoice_details
);


// Store Routers
router.get(
    "/store-connect",
    AuthorizeMiddleware.wed_authorize,
    AuthorizeMiddleware.checksubscription,
    ShopifyStoreController.StoreConnect
);
router.post("/store-connect", upload.none(), AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, ShopifyStoreController.StoreConnect);

router.get("/create-new-store/:store_id", AuthorizeMiddleware.wed_authorize, ShopifyStoreController.CreateNewStore);
router.post("/change-default-store", AuthorizeMiddleware.wed_authorize, ShopifyStoreController.ChangeDefaultStore);

router.get("/:store_id/manage-store", AuthorizeMiddleware.wed_authorize, ShopifyStoreController.manage_store);


// Dashboard Routers
router.get("/:store_id/dashboard", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, DashboardController.dashboard);

//Customize Checkout Routers
router.get(
   "/:store_id/customize-checkout",
    AuthorizeMiddleware.wed_authorize,
    AuthorizeMiddleware.checksubscription,
    CustomizeCheckoutController.customize_checkout
);
router.post("/customize-checkout", upload.none(), AuthorizeMiddleware.wed_authorize, CustomizeCheckoutController.customize_checkout);
router.get("/:store_id/preview-checkout", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, CustomizeCheckoutController.preview_checkout);
router.get("/:store_id/preview-thankyou", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, CustomizeCheckoutController.preview_thankyou);
router.post("/checkout-delete-section", upload.none(), AuthorizeMiddleware.wed_authorize, CustomizeCheckoutController.delete_section);
router.get(
    "/:store_id/get-shop-token",
    AuthorizeMiddleware.wed_authorize,
    AuthorizeMiddleware.checksubscription,
    CustomizeCheckoutController.get_shopToken
);

//Shipping Rate Routers
router.get(
    "/:store_id/shipping-rates",
    AuthorizeMiddleware.wed_authorize,
    AuthorizeMiddleware.checksubscription,
    ShippingRateController.shipping_rates
);
router.get(
    "/:store_id/add-shipping-rate",
    AuthorizeMiddleware.wed_authorize,
    AuthorizeMiddleware.checksubscription,
    ShippingRateController.add_shipping_rate
);
router.post("/add-shipping-rate", upload.none(), AuthorizeMiddleware.wed_authorize, ShippingRateController.add_shipping_rate);

router.get("/:store_id/edit-shipping-rate/:id", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, ShippingRateController.edit_shipping_rate);
router.post("/edit-shipping-rate/", upload.none(), AuthorizeMiddleware.wed_authorize, ShippingRateController.edit_shipping_rate);

router.delete("/delete-shipping-rate", upload.none(), AuthorizeMiddleware.wed_authorize, ShippingRateController.delete_shipping_rate);

//Payment Method Routers
router.get(
    "/:store_id/payment-methods",
    AuthorizeMiddleware.wed_authorize,
    AuthorizeMiddleware.checksubscription,
    PaymentMethodsController.payment_methods
);
//payment methods
router.get("/:store_id/add-payment-method", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, PaymentMethodsController.add_payment_method);
router.post("/add-payment-method", upload.none(), AuthorizeMiddleware.wed_authorize, PaymentMethodsController.add_payment_method);
router.get("/:store_id/payment-method/:id", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, PaymentMethodsController.edit_payment_method);
router.post("/delete-payment-method/", upload.none(), AuthorizeMiddleware.wed_authorize, PaymentMethodsController.delete_payment_method);
router.post("/edit-payment-method/:id", upload.none(), AuthorizeMiddleware.wed_authorize, PaymentMethodsController.edit_payment_method);

//translations
router.get("/:store_id/translations", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, TranslationController.Translation);
router.post("/change-language", upload.none(), TranslationController.change_language);
router.post("/translations", upload.none(), AuthorizeMiddleware.wed_authorize, TranslationController.Translation);
router.post("/delete-translation", upload.none(), AuthorizeMiddleware.wed_authorize, TranslationController.delete_translation);

//automatic discounts
router.get("/:store_id/discounts", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, AutomaticDiscountController.discount_listing);
router.get("/:store_id/add-discount", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, AutomaticDiscountController.add_discount);
router.post("/delete-discount", upload.none(), AuthorizeMiddleware.wed_authorize, AutomaticDiscountController.delete_discount);
router.post("/add-discount", upload.none(), AuthorizeMiddleware.wed_authorize, AutomaticDiscountController.add_discount);

//custom domain 
router.get("/:store_id/custom-domain", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, CustomDomainController.custom_domain);
router.post("/add-custom-domain", upload.none(), AuthorizeMiddleware.wed_authorize, CustomDomainController.add_custom_domain);
router.get("/:store_id/add-custom-domain", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, CustomDomainController.add_custom_domain);
router.post("/custom-domain",upload.none(), AuthorizeMiddleware.wed_authorize,  CustomDomainController.custom_domain);
router.post("/delete-custom-domain",upload.none(), AuthorizeMiddleware.wed_authorize,  CustomDomainController.delete_custom_domain);

router.get("/:store_id/taxes", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, TaxesController.taxes_index);
router.get("/:store_id/taxes/new", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, TaxesController.add_taxes);

router.get("/:store_id/buy-link", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, BuyLinkController.buy_link);
router.post("/buy-link", AuthorizeMiddleware.wed_authorize, BuyLinkController.buy_link);

router.get("/:store_id/upsell", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, UpsellController.upsell);
router.get("/:store_id/add-upsell", AuthorizeMiddleware.wed_authorize, AuthorizeMiddleware.checksubscription, UpsellController.add_upsell);

/*** Stripe Webhook ***/
router.post("/stripe-webhook", upload.none(), StripeWebhook.StripeWebhook);


/*** Test Routers ***/
router.get("/test", TestController.test);
router.get("/test-subscription", TestController.test_subscription);


/************************** Single Route For Multiple Payment Method **************************/
router.get("/Products", ShopifyStoreController.Test);
router.post('/pay', upload.none(), ShopifyStoreController.PaymentGateways)

/*** Stripe api ***/
router.post('/ConnectCreate', ShopifyStripeController.ConnectCreate)
router.post('/MakePayment', ShopifyStripeController.MakePayment)

/*** Paypal api ***/
router.get('/paypal-success', ShopifyPaypalController.getSuccessPaypal)
router.get('/paypal-cancel', ShopifyPaypalController.cancelPaypal);
router.post('/order-create', OrderController.OrderCreate)

/************************** Admin Router **************************/
router.get("/get-products", upload.none(), AdminSubscriptionController.get_product);
router.post("/create-product", upload.none(), AdminSubscriptionController.create_product);
router.get("/get-subscription-packages", upload.none(), AdminSubscriptionController.get_subscription_packages);
router.post("/create-subscription-package", upload.none(), AdminSubscriptionController.create_subscription_packages);

/************************** checkout save *************************/
router.post("/create-checkout/:store_id", CheckoutController.create_checkout);
router.get("/get-checkout/:checkout_id/:store_id", CheckoutController.get_checkout);
router.put("/put-checkout/:checkout_id/:store_id", CheckoutController.update_checkout);
router.get("/:store_id/checkout/:checkout_id", CheckoutController.frontend_checkout);
router.get("/:store_id/checkout_thanks/:checkout_id", CheckoutController.checkout_thanks);

router.get("/checkoutDomain", CheckoutController.checkoutDomain);
router.get("/checkout-redirect", CheckoutController.checkout_redirect)


router.get('/:username',AuthorizeMiddleware.test)
  

module.exports = router;