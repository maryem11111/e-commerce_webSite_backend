const { genSalt } = require('bcrypt');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Coupon = require('../models/couponModel');
const Order = require('../models/orderModel');
const uniqid = require('uniqid');
const asyncHandler = require("express-async-handler");
const { generateToken } = require('../config/jwtToken');
const validatMongodbId = require('../utils/validateMongodbId');
const {generaterefreshToken } = require('../config/refreshToken');
const sendEmail = require('../controllers/emailController');

const jwt = require('jsonwebtoken');


const crypto = require('crypto');
 
 // create a user
const createUser = asyncHandler(async (req , res) =>{
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if (!findUser){
        //Create a new User
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        throw new Error ('User Already Exists ');
    }
});

//Login a user
const loginUserController = asyncHandler(async(req, res)=>{
    const {email,password}=req.body;
   //check if user exists or not
    const findUser = await User.findOne({email});
    if (findUser && await findUser.isPasswordMatched(password)){
        const refreshToken = await generaterefreshToken(findUser?.id);
        const updatedUser = await User.findByIdAndUpdate(findUser.id,{
            refreshToken: refreshToken,
        }, {new : true});
        res.cookie("refreshToken",refreshToken,{httpOnly: true, maxAge: 72*60*60*1000});
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    }else{
        throw new Error("invalid Credentials")
    }
});

//adminLogin 
const loginAdmin = asyncHandler(async(req, res)=>{
    const {email,password}=req.body;
   //check if user exists or not
    const findAdmin = await User.findOne({email});
    if (findAdmin.role !== 'admin') throw new Error("Not Authorised ");
    if (findAdmin && await findAdmin.isPasswordMatched(password)){
        const refreshToken = await generaterefreshToken(findAdmin?.id);
        const updatedUser = await User.findByIdAndUpdate(findAdmin.id,{
            refreshToken: refreshToken,
        }, {new : true});
        res.cookie("refreshToken",refreshToken,{httpOnly: true, maxAge: 72*60*60*1000});
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    }else{
        throw new Error("invalid Credentials")
    }
});


// handle refresh token
const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    console.log(cookie);
    if (!cookie?.refreshToken) throw new Error("No refrech token in cookies");
    const refreshToken = cookie.refreshToken;
    console.log({refreshToken});
    const user = await User.findOne({refreshToken});
    if (!user) throw new Error ("No refresh token present in db or not matched");
    jwt.verify(refreshToken,process.env.JWT_SECRET, (err, decode) =>{
        if (err || user.id !== decode.id){
            throw new Error ("There is some issue with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({
            accessToken
        });
    });
    
});

// logout functionality
const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refrech token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if (!user) {
        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus (204); //forbidden
    }
        await User.findOneAndUpdate({refreshToken}, {
            refreshToken: "",
        });
        res.clearCookie("refreshToken",{
            httpOnly: true,
            secure: true,   
        });
         res.sendStatus (204); //forbidden
});
    
    

//Update a user
const updatedUser = asyncHandler(async(req, res) =>{
    console.log();
    const { _id } = req.user;
    
    validatMongodbId(_id);
    try {
        const updatedUser = await User.findByIdAndUpdate(_id,{
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new: true,
        }
    );
    res.json(updatedUser);

    } catch (error) {
        throw new Error(error)
    }
});

//save user Address
const saveAddress = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    validatMongodbId(_id);
    
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            
            address: req?.body?.address,
            
        },
        {new: true,
    
        }
    );
    res.json(updatedUser);

    } catch (error) {    
        throw new Error(error);
    }
});
//Get All users

const getAllUser = asyncHandler(async(req, res) =>{
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
        
    }
});

// Get a single user 

const getaUser = asyncHandler(async (req,res) =>{
    console.log(req.params);
    const {id} = req.params;
    validatMongodbId(id);
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        })

    } catch (error) {
        throw new Error(error);
    }
});

// Delete user 
const deleteaUser = asyncHandler(async (req,res) =>{
    console.log(req.params);
    const {id} = req.params;
    validatMongodbId(id);
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        })

    } catch (error) {
        throw new Error(error);
    }
});
 // block User
 const blockUser = asyncHandler(async(req,res) =>{
    const {id} = req.params;
    validatMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(id,{
            isBlocked: true,
        },
    {
        new:true,
    });
    res.json({
        message: "User Blocked",
    });
    } catch (error) {
        throw new Error(error);
    }
 });

 // Unblock User
 const unblockUser = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    validatMongodbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(id,{
            isBlocked: false,
        },
    {
        new:true,
    });
    res.json({
        message: "User Unblocked",
    });
    } catch (error) {
        throw new Error(error);
    }
 });
 
 const updatePassword = asyncHandler(async(req, res) =>{
    const {_id} = req.user; 
    const {password} = req.body;
    validatMongodbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    }else{
        res.json(user);
    }
 });
 const forgetPasswordToken = asyncHandler(async(req, res) => {
     const {email}= req.body;
     const user = await User.findOne({email});
     if(!user){
         throw new Error("User not found with this email");
     }
     try {
         const token = await user.createPasswordResetToken();
         await user.save();
         const resetURL = `Hi, please click on the link to reset your password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click here</a>`;
         const data = {
             to: email,
             text: "Hey User",
             subject: "Forgot Password Link",
             html: resetURL,
         };
         sendEmail(data);
         res.json(token);
 } catch (error) {
     throw new Error(error);
 }
 });    
    
 const resetPassword = asyncHandler(async(req, res) => {
     const {password} = req.body;
     const {token} = req.params;
     const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
     const user = await User.findOne({
         passwordResetToken: hashedToken,
         passwordResetExpires: {$gt: Date.now()},   
     });
     if (!user) throw new Error("Token expired, try again later");
     user.password = password;
     user.passwordResetToken = undefined;
     user.passwordResetExpires = undefined;
     await user.save();
     res.json(user);
 }); 

 const getWishList = asyncHandler(async(req, res) => {
     const {_id} = req.user;
     
     try {
        validatMongodbId(_id);
         const findUser = await User.findById(_id).populate("wishList");
         res.json(findUser);
     } catch (error) {
         throw new Error(error);
     }
 });

 const userCart = asyncHandler(async(req, res) => {
    const {cart } = req.body;
    const {_id} = req.user;
    validatMongodbId(_id);
    try {
        let products = [];
        const user = await User.findById(_id);

        //check if user already have product in cart
        const alreadyExistCart = await User.findOne({orderby: user._id});
        if(alreadyExistCart){
            alreadyExistCart.remove();
        }
        for(let i = 0; i<cart.length; i++){
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }
       let cartTotal = 0;
       for(let i = 0; i<products.length; i++){
           cartTotal = cartTotal + products[i].price * products[i].count
       }
      let newCart = await new Cart({
            products,
            cartTotal,
            totalAfterDiscount: 0,
            orderby: user?._id,
        }).save();
        res.json(newCart);
 }
     catch (error) {
         throw new Error(error);
     }
     });

const getUserCart =  asyncHandler(async(req, res) => {
    console.log("req.user ===>", req.user);

    const {_id} = req.user;
    validatMongodbId(_id);
    try {
        const cart = await Cart.findOne({orderby: _id}).populate("products.product");
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const emptyCart = asyncHandler(async(req, res) => {
    console.log("req.user ===>", req.user);
    const {_id} = req.user;
    validatMongodbId(_id);
    try {
        const user = await User.findOne({_id});
        const cart = await Cart.findOneAndDelete({orderby: user._id});
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});

const applyCoupon = asyncHandler(async(req, res) => {
    const {coupon} = req.body;
    const {_id} = req.user;
    validatMongodbId(_id);
    const validCoupon = await Coupon.findOne({name: coupon});
  
    if(validCoupon === null) throw new Error("Invalid coupon");
     const user = await User.findOne({_id});
     let {products, cartTotal} = await Cart.findOne({orderby: user._id}).populate("products.product");
      

     let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);
     console.log("totalAfterDiscount", totalAfterDiscount);
     await Cart.findOneAndUpdate({orderby: user._id}, {
        totalAfterDiscount,
    //     discount: validCoupon.discount,
     }, {new: true});
     res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {COD, couponApplied} = req.body;
    validatMongodbId(_id);

    try {
        if (!COD) throw new Error("Create cash order failed");
        
        let user = await User.findById(_id);
        let userCart = await Cart.findOne({orderby: user._id});
        
        // Vérification si le panier est vide
        if (userCart.products.length === 0) {
            return res.status(400).json({ message: "Cart is empty. Add products to the cart before placing an order." });
        }

        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount * 100;
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                created: Date.now(),
                currency: "usd",
                status: "Cash on Delivery",
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery",
        }).save();

        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: {_id: item.product._id},
                    update: {$inc: {quantity: -item.count}}
                },
            };
        });

        const updated = await Product.bulkWrite(update, {});
        res.json({
            msg: "Commande réussie",
        });
    } catch (error) {
        throw new Error(error);
    }
});

const updateOrderStatus = asyncHandler(async(req, res) => {
    const {status} = req.body;
    const {id} = req.params;
    validatMongodbId(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(id, {
            orderStatus: status,
            paymentIntent: {
                status: status,
            },
        },
        {new: true});
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports={createUser ,
     loginUserController, 
     getAllUser ,
      getaUser , 
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
         emptyCart,
         applyCoupon,
         createOrder,
         updateOrderStatus};






