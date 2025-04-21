const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async(req, res, next) =>{
    console.log("→ authMiddleware : req.method, req.path, req.body =", req.method, req.path, req.body);
     let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token= req.headers.authorization.split(" ")[1];
        try {
           if(token){
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decoded.id);
            const user = await User.findById(decoded?.id);
            console.log(user);
            req.user = user;
            next();
           }
        } catch (error) {
          throw new Error ("Not Authorized token expired, please login again")  
        }
    }else{
        throw new Error ("There is no token attached to header");
     }
});
const isAdmin = asyncHandler(async(req, res, next)=>{
   // console.log(req.user);
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if (adminUser.role !== "admin"){
        throw new Error('You are not admin')
    }else{
        next();
    }
})
module.exports={authMiddleware , isAdmin};
