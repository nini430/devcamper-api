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

const advancedResults=require('../middleware/advancedResults')
const Bootcamp=require('../models/Bootcamp')

const router = express.Router();

// load other resources route

const courseRouter=require('./courses')

// reroute to other resources route

router.use("/:bootcampId/courses",courseRouter);

router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamps).post(createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
  router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;
