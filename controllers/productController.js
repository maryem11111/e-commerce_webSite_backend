const Product = require("../models/productModel");
const asyncHandler = require('express-async-handler');
const User = require ('../models/userModel')
const slugify = require('slugify');
const fs = require('fs');
const validatMongodbId = require("../utils/validateMongodbId");
const  {cloudinaryUploadImg, cloudinaryDeleteImg}  = require("../utils/cloudinary");



//create a product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
            
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
});

//update a product
const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
   try {
     if(req.body.title){
        req.body.slug = slugify(req.body.title);
     }
     const updateProduct = await Product.findByIdAndUpdate(id,req.body,{
        new:true
    });
    res.json(updateProduct);
   } catch (error) {
     throw new Error(error);
   }
   });

   // delete a product

   const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
   try {
     const updateProduct = await Product.findByIdAndDelete(id);
    res.json(updateProduct);
   } catch (error) {
     throw new Error(error);
   }
   });


//get a single product  
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});


//get all products
const getAllProduct = asyncHandler(async (req, res) => {
    //console.log(req.query);
    try {
        // Filtering
        const queryObj = {...req.query};
        const excludeFields  = ['page','sort','limit','fields'];
        excludeFields.forEach(el => delete queryObj[el]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr  = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        //Sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createdAt');
        }

         //limiting the fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        //pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) *limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error("This page does not exist");
        }
       
        console.log(page,limit,skip);
         
        const products = await query;
        res.json(products);
    } catch (error) {
        throw new Error(error);
    }
});
const addToWishList = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {prodId} = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyAdded){
            let user = await User.findByIdAndUpdate(_id, {
                $pull : {wishlist : prodId},
            },
            {
                new: true,
            }
        );
          res.json(user);
        }else{   
            let user = await User.findByIdAndUpdate(_id, {
                $push : {wishlist : prodId},
            },
            {
                new: true,
            }
        );
          res.json(user);

        }
    } catch (error) {
        throw new Error(error);
    }
});
 const rating = asyncHandler(async (req, res) =>{
    const {_id} =req.user;
    const {star, prodId,comment } = req.body;
    try {
        const product = await Product.findById(prodId);

    let alreadyRated = product.ratings.find((rating) => rating.postedby.toString() === _id.toString());
    if (alreadyRated){
        await Product.updateOne(
            { _id: prodId, "ratings.postedby": _id },
            { $set: { "ratings.$.star": star, "ratings.$.comment": comment}, },
            { new: true }
        );
    } else {
        
        await Product.findByIdAndUpdate(
            prodId,
            {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedby: _id,
                    },
                },
            },
            { new: true }
        );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings.map((item )=> item.star).reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate (
        prodId,
        {
            totalrating: actualRating,
        },
        {new: true}
    );
    res.json (finalproduct);
    } catch (error) {
        throw new Error(error)
    }
 });

 const uploadImages = asyncHandler(async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;

            const newpath = await uploader(path);
            console.log("Upload successful:", newpath);

            urls.push(newpath);

            
            fs.unlink(path, (err) => {
                if (err) {
                    console.error("Failed to delete file:", path, err.message);
                } else {
                    console.log("Deleted file:", path);
                }
            });
        }

        const images = urls.map((file) => file);
        res.json(images);
    } catch (error) {
        console.error("Error in uploadImages:", error.stack || error.message || error);
        res.status(500).json({ message: "An error occurred while uploading images." });
    }
});

const DeleteImages = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try{
        const deleted =  cloudinaryDeleteImg(id, "images");
        res.json({
            message: " Deleted ",
        });
        
       
    } catch (error) {
       throw new Error(error);
    }
});

module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
    uploadImages,
    DeleteImages
};