const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc get All courses/ get courses of specific bootcamp
// @routes GET /api/v1/courses or /api/v1/bootcamps/:bootcampId/courses
// access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses= Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({success:true,count:courses.length,data:courses})
  } else {
    return res.status(200).json(res.advancedResults);
  }

  
});

//@desc get single course
//@route /api/v1/courses/:id
//@access Public

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course if found withg id of ${req.params.id}`, 404)
    );
  }

  return res.status(200).json({ success: true, data: course });
});

// @desc create course
// @route POST /api/v1/bootcamps/:bootcampId/courses
//access Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user=req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp is found with thid id ${req.params.bootcampId}`,
        404
      )
    );
  }

  if(bootcamp.user!==req.user.id&&req.user.role!=='admin') {
     return next(new ErrorResponse(`User with id ${req.user.id} is not allowed to create course to this bootcamp`,401));
  }

  const course = await Course.create(req.body);

  return res.status(201).json({ success: true, data: course });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course if found with id of ${req.params.id}`, 404)
    );
  }

  if(course.user!==req.user.id&&req.user.role!=='admin') {
    return next(new ErrorResponse(`The user ${req.user.id} is not allowed to update this course ${course._id}`,401));
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({ success: true, data: course });
});

exports.deleteCourse=asyncHandler(async (req,res,next)=>{
    const course=await Course.findById(req.params.id);
    if(!course) {
      return next(new ErrorResponse(`No course is found with id of ${req.params.id}`,404));
    }

    if(course.user!==req.user.id&&req.user.role!=='admin') {
      return next(new ErrorResponse(`user ${req.user.id} is not allowed to delete the course ${course._id}`,401))
    }

    await course.remove();
    return res.status(200).json({success:true,data:{}})
})


