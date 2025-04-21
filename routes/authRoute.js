const express = require('express');
const { createUser, 
    loginUserController,
     getAllUser, 
     getaUser, 
     deleteaUser, 
     updatedUser, 
     blockUser, 
     unblockUser, 
     handleRefreshToken, 
     logout,
     updatePassword,
     forgetPasswordToken,
     resetPassword,
     loginAdmin,
     getWishList,
     saveAddress,
     userCart,
     getUserCart,
     emptyCart,applyCoupon,
     createOrder,updateOrderStatus} = require('../controllers/userContoller');
const {authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();


router.post("/register", createUser);
router.post("/forgot-password-token", forgetPasswordToken);
router.post("/reset-password/:token", resetPassword);

router.put("/order/update-order/:id",authMiddleware,isAdmin, updateOrderStatus);

router.put("/password-update",authMiddleware,updatePassword);
router.post("/login", loginUserController);
router.post("/admin-login", loginAdmin);
router.post("/cart",authMiddleware, userCart );
router.post("/cart/apply-coupon",authMiddleware,applyCoupon);
router.post("/cart/cash-order",authMiddleware,createOrder);
router.get('/all-users',getAllUser);
router.get("/refresh",handleRefreshToken);
router.get ('/logout', logout);
router.get("/:id",authMiddleware,isAdmin, getaUser);
router.delete("/empty-cart" , authMiddleware, emptyCart);
router.get("/whishlist",authMiddleware, getWishList);
router.get("/cart", authMiddleware, getUserCart);







router.delete("/:id",deleteaUser);
router.put("/edit-user",authMiddleware,updatedUser);
router.put("/save-address",authMiddleware,saveAddress);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser); 




module.exports = router;