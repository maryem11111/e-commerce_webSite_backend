const express = require('express');
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon   } = require('../controllers/couponController');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin,createCoupon);
router.get('/',authMiddleware,isAdmin,getAllCoupons);
router.put('/:id',authMiddleware,isAdmin,updateCoupon);
router.delete('/:id',authMiddleware,isAdmin,deleteCoupon);



module.exports = router;