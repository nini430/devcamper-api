const ErrorResponse=require('../utils/errorResponse')
const asyncHandler=require('../middleware/async')
const Bootcamp=require('../models/Bootcamp')
const Review=require('../models/Review')
const User = require('../models/User')


//@desc get all reviews/get reviews for specific bootcamp
//@route GET /api/v1/reviews || /api/v1/bootcamps/:bootcampId/reviews
//@ Access Public
exports.getReviews=asyncHandler(async(req,res,next)=>{
    if(req.params.bootcampId) {
        const bootcamp=await Bootcamp.findById(req.params.bootcampId);
        if(!bootcamp) {
            return next(new ErrorResponse(`no bootcamp is found with id of ${req.params.bootcampId}`,404))
        }
        const reviews=await Review.find({bootcamp:bootcamp._id});
        return res.status(200).json({success:true,data:reviews,count:reviews.length});
    }else{
        console.log(res.advancedResults)
        return res.status(200).json(res.advancedResults)
    }
})


//@ desc get single review
// route /api/v1/reviews/:id
//access Public

exports.getReview=asyncHandler(async(req,res,next)=>{
    const review=await Review.findById(req.params.id).populate({path:'bootcamp',select:'name description'});

    if(!review) {
        return next(new ErrorResponse(`No review is found with id of ${req.params.id}`))
    }

    return res.status(200).json({success:true,data:review})
})

//@desc create review
// route  /api/v1/bootcamps/:bootcampId/reviews
//access Private

exports.createReview=asyncHandler(async(req,res,next)=>{
    req.body.bootcamp=req.params.bootcampId;
    req.body.user=req.user.id;

    const bootcamp=await Bootcamp.findById(req.params.bootcampId);
    if(!bootcamp) {
        return next(new ErrorResponse(`No bootcamp is found with id of ${req.params.bootcampId}`))
    }

    const review=await Review.create(req.body);

    return res.status(201).json({success:true,data:review})
})         

//@desc update review
//@route /api/v1/reviews/:id
//@access Private
exports.updateReview=asyncHandler(async(req,res,next)=>{
    let review=await Review.findById(req.params.id);

    if(!review) {
        return next(new ErrorResponse(`no review is found with id of ${req.params.id}`,404))
    }

    if(review.user.toString()!==req.user.id && req.user.role!=='admin') {
        return next(new ErrorResponse('Not authorized to access this route',401))
    }

    review=await Review.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});

    return res.status(200).json({success:true,data:review})

    
})

//@ delete review
//@route /api/v1/reviews/:id
//@access Private

exports.deleteReview=asyncHandler(async (req,res,next)=>{
    const review=await Review.findById(req.params.id);
    if(!review) {
        return next(new ErrorResponse(`No review is found with id of ${req.params.id}`))
    }

    if(review.user.toString()!==req.user.id && req.user.role!=='admin') {
        return next(new ErrorResponse(`Not authorized to access this route`,401))
    }

    await review.remove();

    return res.status(200).json({success:true,data:{}})
})