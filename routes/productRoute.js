
const express = require('express');
const { createProduct, getaProduct,getAllProduct, updateProduct, deleteProduct, addToWishList, rating, uploadImages, DeleteImages } = require('../controllers/productController');
const {isAdmin,authMiddleware} = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.post ('/',authMiddleware,isAdmin,createProduct);
router.put ("/upload",authMiddleware,isAdmin,uploadPhoto.array("images",10),productImgResize,uploadImages);
router.get ('/:id',getaProduct);
router.put ("/wishlist", authMiddleware , addToWishList);
router.put ("/rating", authMiddleware , rating);


router.put('/:id',authMiddleware,isAdmin,updateProduct);
router.delete('/:id',authMiddleware,isAdmin,deleteProduct);
router.delete('/delete-img/:id',authMiddleware,isAdmin,DeleteImages);

router.get('/',getAllProduct);

module.exports = router;















