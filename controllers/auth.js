const crypto=require('crypto')
const asyncHandler=require('../middleware/async')
const User=require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail=require('../utils/sendEmail')



//@desc register user
//@route POST /api/v1/auth/register
//@access Public
exports.register=asyncHandler(async(req,res,next)=>{
    const {name,email,password,role}=req.body;

    const user=await User.create({name,email,password,role});

   sendTokenResponse(user,201,res);
})



//@desc login user
//@route POST /api/v1/auth/login
//@access Public

exports.login=asyncHandler(async (req,res,next)=>{
    const {email,password}=req.body;

    //validate email and password

    if(!email || !password) {
        return next(new ErrorResponse('Please enter email and password',400))
    }

    //check for user

    const user=await User.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid credentials',401))
    }

    //check for password

    const isMatch=await user.matchPassword(password);

    if(!isMatch) {
        console.log('no match')
        return next(new ErrorResponse('invalid credentials',401))
    }
    sendTokenResponse(user,200,res);

    
})





//@desc get logged in user
//@route GET /api/v1/auth/me
//@access Private

exports.getMe=asyncHandler(async(req,res,next)=>{
    console.log(req.user,"reqi");
    const user=await User.findById(req.user.id);
    return res.status(200).json({success:true,data:user})
})

// @desc forgot password
// route POST /api/v1/auth/forgorpassword
//@access Public

exports.forgotPassword=asyncHandler(async (req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user) {
        return next(new ErrorResponse('user not found with this email',404))
    }

    const resetToken=user.generatePasswordToken();
    await user.save();

    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

    const message=`You are receiving this E-mail because you (or someone else) has requested a reset of password.
    Please make a put request to:  ${resetUrl}

    `

    try {
        await sendEmail({
            message,
            email:user.email,
            subject:'Password reset request'
        })
        return res.status(200).json({success:true,data:'Email has been sent'})
    }catch(err) {
        console.log(err);
        this.resetPasswordToken=undefined;
        this.resetPasswordExpire=undefined;
        await user.save();
        return next(new ErrorResponse('Email could not be sent',500)) 
    }

   


})


// @ desc reset password
// route PUT /api/v1/auth/resetpassword/:resettoken
// access Public

exports.resetPassword=asyncHandler(async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    console.log(resetPasswordToken)
    const user=await User.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}})
    if(!user) {
        return next(new ErrorResponse('invalid token',400))
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();

    sendTokenResponse(user,200,res);
})


const sendTokenResponse=(user,statusCode,res)=>{
    const token=user.generateJwtToken();

    const options={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    }

    if(process.env.NODE_ENV==='production') {
        options.secure=true;
    }

    return res.status(statusCode)
    .cookie('token',token,options)
    .json({success:true,token})
}

//@desc update user details (name and email)
//@ route PUT /api/v1/auth/updatedetails
//@ Access Private

exports.updateDetails=asyncHandler(async(req,res,next)=>{
    const fieldsUpdated={
        name:req.body.name,
        email:req.body.email
    }

    const user=await User.findByIdAndUpdate(req.user.id,fieldsUpdated,{new:true,runValidators:true});

    return res.status(200).json({success:true,data:user})
})  

//@desc update users password
//@route PUT /api/v1/auth/updatepassword
//access Private

exports.updatePassword=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password');

    if(!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Passwor is incorrect',401))
    }

    user.password=req.body.newPassword;
    await user.save();

    sendTokenResponse(user,200,res);
})


//@desc logout user
//route GET /api/v1/auth/logout
//access Private

exports.logoutUser=asyncHandler(async(req,res,next)=>{
    res.cookie('token','none',{expires:new Date(Date.now()+(10*1000))})
    return res.status(200).json({success:true,data:{}})
})
