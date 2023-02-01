const Bootcamp = require('../models/Bootcamp');
const path=require('path')
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc getAll Bootcamps
// @route GET /api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  
  
  return res.status(200).json(res.advancedResults);


});

// @desc get Single Bootcamp
// @route GET /api/v1/bootcamp/:id
// @access Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp is found with id of ${req.params.id}`, 404)
    );
  }
  return res.status(200).json({ success: true, data: bootcamp });
});

// @desc create bootcamp
// @route POST /api/v1/bootcamps
// @access Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  return res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp is found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp is found with id of ${req.params.id}`, 404)
    );
  }
  bootcamp.remove();
  return res.status(200).json({ success: true, data: {} });
});

// @desc get bootcamps within radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance (distance in miles)
// @access Public

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get latitude and longitude based on zipcode
  const loc = await geocoder.geocode(zipcode);
  const lng = loc[0].longitude;
  const lat = loc[0].latitude;

  // get radius (radius of earth is  3963 miles);

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  return res.status(200).json({success:true,count:bootcamps.length,data:bootcamps})
});

//@desc bootcamp photo upload
// @route PUT /api/v1/bootcamps/:id/photo
// @access private

exports.bootcampPhotoUpload=asyncHandler(async(req,res,next)=>{
    const bootcamp=await Bootcamp.findById(req.params.id);
    if(!bootcamp) {
      return next(new ErrorResponse(`No bootcamp is found with id of ${req.params.id}`,404))
    }

    //check if file is uploaded or not
    if(!req.files) {
      return next(new ErrorResponse('Please upload a file',400))
    }
    const file=req.files.file;
    //check if image is a photo
    if(!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse('pleas upload image file',400))
    }

    //check if file size doesnt exceed limit

    if(file.size>process.env.MAX_FILE_SIZE) {
      return next(new ErrorResponse(`Please upload file with less than ${process.env.MAX_FILE_SIZE} bytes`,400))
    }

    file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`

    file.mv(`${process.env.IMAGE_FILES_PATH}/${file.name}`,async err=>{
      if(err) {
        console.error(err);
        return next(new ErrorResponse('Error uploading the image',500))
      }

      await Bootcamp.findByIdAndUpdate(req.params.id,{
        photo:file.name
      })
      return res.status(200).json({success:true,data:file.name})
    })

})