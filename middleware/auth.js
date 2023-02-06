const jwt=require('jsonwebtoken');
const User=require('../models/User')
const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('./async')


exports.protect=asyncHandler(async(req,res,next)=>{
        let token;
        console.log(req.cookies.token)
        if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')) {
            token=req.headers.authorization.split(' ')[1];
            console.log("anu")
        }else if(req.cookies.token) {
            console.log('holllaaaa cookieee');
            console.log(req.cookies);
            token=req.cookies.token;
            
        }

        

        //check token exists

        if(!token) {
            return next(new ErrorResponse('Not authorized to access this route',401))
        }

        try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded,'dekod');
        console.log('decodedid',decoded.id)
        req.user=await User.findById(decoded.id);
    
        console.log(req.user,'middl');
        next();
        }catch(err) {
            console.log(err);
            return next(new ErrorResponse('Not authorized to access this route',401))
        }
})

exports.authorize=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User with role ${req.user.role} is not allowed to access this route`,403))
        }
        next();
    }
}