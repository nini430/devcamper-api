const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add number of weeks'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'please add minimum skill required for this course'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add tuition for the course'],
  },
  scholarshipsAvaliable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

CourseSchema.statics.getAverageCost=async function(bootcampId) {
   const obj=await this.aggregate([
    {
      $match:{
        bootcamp:bootcampId
      }
    },
    {
      $group:{
        _id:'$bootcamp',
        averageCost:{$avg:'$tuition'}
      }
    }
   ])

   try{
    await  this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
      averageCost:obj[0].averageCost
    })
   }catch(err) {
    console.log(err);
   }
}

CourseSchema.post('save',async function() {
  this.constructor.getAverageCost(this.bootcamp)
})

CourseSchema.pre('remove',async function() {
  this.constructor.getAverageCost(this.bootcamp);
})

module.exports = mongoose.model('Course', CourseSchema);
