const express = require('express');
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, DislikeBlog,uploadImages } = require('../controllers/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { BlogImgResize , uploadPhoto} = require('../middlewares/uploadImages');
const router = express.Router();


router.post("/", authMiddleware, isAdmin, createBlog);
router.get("/", getAllBlogs);

router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10), BlogImgResize, uploadImages); 

router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, DislikeBlog);


router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", authMiddleware, isAdmin, getBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);

module.exports = router;