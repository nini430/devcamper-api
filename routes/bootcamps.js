const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const {protect,authorize}=require('../middleware/auth')

const advancedResults=require('../middleware/advancedResults')
const Bootcamp=require('../models/Bootcamp')

const router = express.Router();

// load other resources route

const courseRouter=require('./courses')
const reviewRouter=require('./reviews');

// reroute to other resources route

router.use("/:bootcampId/courses",courseRouter);
router.use("/:bootcampId/reviews",reviewRouter);

router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamps).post(protect,authorize('admin','publisher'),createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect,authorize('admin','publisher'),updateBootcamp)
  .delete(protect,authorize('admin','publisher'),deleteBootcamp);
  router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect,authorize('admin','publisher'),bootcampPhotoUpload);

module.exports = router;
