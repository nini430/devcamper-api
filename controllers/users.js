const User=require('../models/User')
const ErrorResponse=require('../utils/errorResponse');
const asyncHandler=require('../middleware/async')


//@desc get Users
//@route GET /api/v1/users
//Access private/Admin

exports.getUsers=asyncHandler(async(req,res,next)=>{
    return res.status(200).json(res.advancedResults);
})

//@desc get User
//@route GET /api/v1/users/:id
//Access private/Admin

exports.getUser=asyncHandler(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorResponse(`No user is found with the id of ${req.params.id}`,404))
    }
    return res.status(200).json({success:true,data:user})
})

//@desc create User
//@route POST /api/v1/users
//Access private/Admin

exports.createUser=asyncHandler(async(req,res,next)=>{
    const user=await User.create(req.body);

    return res.status(201).json({success:true,data:user})
})

//@desc update User
//@route PUT /api/v1/users/:id
//Access private/Admin

exports.updateUser=asyncHandler(async(req,res,next)=>{
    let user=await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorResponse(`No user is found with id of ${req.params.id}`))
    }

    user=await User.findByIdAndUpdate(req.params .id,req.body,{new:true,runValidators:true})

    return res.status(200).json({success:true,data:user})
})

//@desc delete User
//@route DELETE /api/v1/users/:id
//Access private/Admin

exports.deleteUser=asyncHandler(async (req,res,next)=>{
    let user=await User.findById(req.params.id);
    if(!user) {
        return next(new ErrorResponse(`No user is found with id of ${req.params.id}`,404))
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({success:true,data:{}})
})







