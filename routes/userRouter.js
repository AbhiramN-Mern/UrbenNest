const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/user/userController');
const { userAuth, guestAuth, adminAuth } = require('../middlewares/auth');
const customerController = require('../controller/admin/customerController');
const productController = require('../controller/user/productController');
const profileController = require('../controller/user/profileController');
const wishlistController = require("../controller/user/wishlistcontroller");
const CartController = require("../controller/user/cartController");
const orderController = require('../controller/user/orderController');
require('dotenv').config();

const razorpay = require("../config/razorpay");

// Static / Info pages
router.get('/pageNotFound', usercontroller.pageNotFound);
router.get('/contact', usercontroller.loadContact);
router.get('/about', usercontroller.loadAbout);

// Home & Public pages
router.get('/', usercontroller.loadhomepage);
router.get('/shop', usercontroller.loadShoppingPage);
router.get('/filter', usercontroller.filterProducts);
router.get('/product-details', productController.productDetails);
router.get('/productDetails', productController.productDetails);

// Auth routes
router.get('/signup', guestAuth, usercontroller.loadsignup);
router.post('/signup', guestAuth, usercontroller.signup);
router.post('/verify-otp', usercontroller.verifyOTP);
router.post('/resend-Otp', usercontroller.resendOTP);
router.post('/resend-otp', usercontroller.resendOTP);

router.get('/login', guestAuth, usercontroller.loadlogin);
router.post('/login', guestAuth, usercontroller.login);
router.get('/logout', usercontroller.logout);

// Admin-accessible user list (kept for compatibility)
router.get('/users', adminAuth, customerController.customerInfo);

// Password recovery
router.get("/forgot-password", guestAuth, profileController.getForgetPassPage);
router.post("/forgot-email-valid", guestAuth, profileController.forgotEmailValid);
router.post("/verify-passForgot-otp", profileController.verifyForgotPassOtp);
router.get("/verify-passForgot-otp", profileController.getVerifyForgotOTPPage);
router.get("/reset-password", profileController.getResetPassPage);
router.post("/reset-password", profileController.postNewPassword);
router.post("/resend-forgot-otp", profileController.resendOtp);

// Change password
router.get("/change-password", userAuth, profileController.changePassword);
router.post("/change-password", userAuth, profileController.changePasswordValid);
router.post("/verify-changepassword-otp", userAuth, profileController.verifyChangePassOtp);
router.post("/verify-change-pass-otp", userAuth, profileController.verifyChangePassOtp);
router.post("/resend-changepassword-otp", userAuth, profileController.resendOtp);

// Profile management
router.get("/userProfile", userAuth, profileController.userProfile);
router.get('/change-email', userAuth, profileController.changeEmail);
router.post('/change-email', userAuth, profileController.changeEmailValid);
router.post('/verify-email-otp', userAuth, profileController.verifyEmailOtp);
router.post('/update-email', userAuth, profileController.updateEmail);

// Address Management
router.get("/addAddress", userAuth, profileController.addAddress);
router.post('/addAddress', userAuth, profileController.postAddAddress);
router.get('/editAddress', userAuth, profileController.editAddress);
router.post('/editAddress', userAuth, profileController.postEditAddress);
router.get('/deleteAddress', userAuth, profileController.deleteAddress);

// Wallet Management
router.post("/wallet/addMoney", userAuth, profileController.addMoneyToWallet);
router.post("/wallet/paymentSuccess", userAuth, profileController.walletPaymentSuccess);

// Wishlist Management
router.get('/wishlist', userAuth, wishlistController.loadWishList);
router.post("/addTOWishlist", wishlistController.addToWishlist);
router.get('/removeFromWishlist', userAuth, wishlistController.removeProduct);
router.get('/getWishlistCount', wishlistController.getWishlistCount);

// Cart Management
router.get("/cart", userAuth, CartController.getCartPage);
router.post("/addToCart", userAuth, CartController.addToCart);
router.delete("/deleteItem", userAuth, CartController.deleteItem);
router.post("/changeQuantity", userAuth, CartController.changeQuantity);
router.post("/checkProductInCart", CartController.checkProductInCart);
router.get("/getCartCount", CartController.getCartCount); 

// Order Management
router.get("/checkout", userAuth, orderController.getCheckoutPage);
router.get("/deleteItem", userAuth, orderController.deleteProduct); 
router.post("/orderPlaced", userAuth, orderController.orderPlaced);
router.post("/applyCoupon", userAuth, orderController.applyCoupon);
router.get("/orderDetails", userAuth, orderController.getOrderDetailsPage);
router.put("/cancelOrder", userAuth, orderController.cancelOrder); 
router.put("/returnrequestOrder", userAuth, orderController.returnorder); 
router.put("/singleProductId", userAuth, orderController.changeSingleProductStatus); 
router.get("/downloadInvoice/:orderId", userAuth, orderController.downloadInvoice);
router.post("/create-razorpay-order", userAuth, orderController.createRazorpayOrder);
router.post("/verify-razorpay-payment", userAuth, orderController.verifyRazorpayPayment);
router.get('/availableCoupons', userAuth, orderController.getAvailableCoupons);
router.post('/removeCoupon', userAuth, orderController.removeCoupon);
router.post('/complete-payment', userAuth, orderController.completePayment);
router.post('/addReview', userAuth, orderController.addReview);

module.exports = router;