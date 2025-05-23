const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validatMongodbId = require("../utils/validateMongodbId");

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json({
                status: "success",
                newCoupon,
        });
    } catch (error) {
        throw new Error(error);
    }
});
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json({
               
            coupons,
        });
    } catch (error) {
        throw new Error(error);
    }
});
const updateCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validatMongodbId(id);
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id , req.body , {new: true});
        res.json({
               
            updatedCoupon,
        });
    } catch (error) {
        throw new Error(error);
    }
});
const deleteCoupon = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validatMongodbId(id);
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(id);
        res.json({
               
            deleteCoupon,
        });
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {createCoupon , getAllCoupons,updateCoupon , deleteCoupon};