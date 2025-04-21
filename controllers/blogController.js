const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const fs = require("fs");
const validatMongodbId = require("../utils/validateMongodbId"); 
const {cloudinaryUploadImg}  = require("../utils/cloudinary");

const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
        status: "success",
        newBlog,
    });
  } catch (error) {
    throw new Error(error);
  }
});
const updateBlog = asyncHandler(async (req, res) => {
  const {id} = req.params;
  validatMongodbId(id);
   
    try {
      const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true});
      res.json( updateBlog);
    } catch (error) {
      throw new Error(error);
    }
  });

  const getBlog = asyncHandler(async (req, res) => {
    const {id} = req.params
    validatMongodbId(id);
    try {

      const getBlog = await Blog.findById(id).populate("likes").populate("dislikes");
      await Blog.findByIdAndUpdate(id,
        {
            $inc: {numViews: 1},
        },
        {new: true}
      );

      res.json(getBlog);
    } catch (error) {
      throw new Error(error);
    }
  });

  const getAllBlogs = asyncHandler(async (req, res) => {
    try {
      const getAllBlogs = await Blog.find();
      res.json(getAllBlogs);
    } catch (error) {
      throw new Error(error);
    }
  });

  const deleteBlog = asyncHandler(async (req, res) => {
    const {id} = req.params
    validatMongodbId(id);
    try {
      const deletedBlog = await Blog.findByIdAndDelete(id);
      res.json(deletedBlog);
    } catch (error) {
        
    }
  });
  const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    console.log("req.headers:", req.headers);
    console.log("req.body   :", req.body);
    console.log("blogId  :", req.bodyblogId);
    validatMongodbId(blogId);
    //console.log(blogId)
  

    //On verfie que le blog existe 
    const blog = await Blog.findById(blogId);
    // const loginUserId = req?.user?._id;
    // const isLiked = blog?.isLiked;
    // const alreadyDisliked = blog?.dislikes?.find(userId => userId.toString() === loginUserId.toString());

    if (!blog) {
      return res.status(404).json({message: "Blog non trouvé"});
    }
    const loginUserId = req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(userId => userId.toString() === loginUserId.toString());
  

    
    if (alreadyDisliked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
     res.json(updatedBlog);
    }
  
    if(isLiked){
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(updatedBlog);
    }
    else{
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(updatedBlog);
    }
  });
  const DislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    
    validatMongodbId(blogId);
   
  

    //On verfie que le blog existe 
    const blog = await Blog.findById(blogId);
  
    if (!blog) {
      return res.status(404).json({message: "Blog non trouvé"});
    }
    const loginUserId = req?.user?._id;
    const isDisLiked = blog?.isDisliked;
    const alreadyLiked = blog?.likes?.find(userId => userId.toString() === loginUserId.toString());
  

    
    if (alreadyLiked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: {likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
     res.json(updatedBlog);
    }
  
    if(isDisLiked){
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(updatedBlog);
    }
    else{
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes:loginUserId},
          isDisliked: true,
        },
        { new: true }
      );
      res.json(updatedBlog);
    }
  });

  // const uploadBlogImages = asyncHandler(async (req, res) => {
  //   console.log(req.files);
  //   res.json("Blog images uploaded successfully");
  // });

  const uploadImages = asyncHandler(async (req, res) => {
    const {id} = req.params;
    validatMongodbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for(const file of files){
            const {path} = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            console.log(file)
            fs.unlinkSync(path);
        }
        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map((file) => {
                return file;
            }),
        },{
            new: true,
        });
       res.json(findBlog);
    } catch (error) {
        throw new Error(error); 
    }
 });

  

module.exports = {createBlog, updateBlog , getBlog , getAllBlogs, deleteBlog, likeBlog, DislikeBlog ,  uploadImages} ;