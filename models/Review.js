const mongoose=require('mongoose')
const Bootcamp =require('../models/Bootcamp')


const ReviewSchema=mongoose.Schema({
    title:{
        type:String,
        trim:true,
        maxlength:100,
        required:[true,'Please add a title for the review']
    },
    text:{
        type:String,
        required:[true,'Please add text for your review']
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true,'Please rate the bootcamp between 1 and 10']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    bootcamp:{
        type:mongoose.Types.ObjectId,
        ref:'Bootcamp',
        required:true
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    }
})

ReviewSchema.index({bootcamp:1,user:1},{unique:true});

ReviewSchema.statics.getAverageRating=async function(bootcampId) {
    const obj=await this.aggregate([
        {
            $match:{bootcamp:bootcampId}
        },
        {
            $group:{
                _id:'$bootcamp',
                averageRating:{$avg:'$rating'}
            }
        }
    ])

    try{
    await Bootcamp.findByIdAndUpdate(bootcampId,{
        averageRating:obj[0].averageRating
    })
    }catch(err) {
        console.log(err);
    }
}

ReviewSchema.post('save',function() {
    this.constructor.getAverageRating(this.bootcamp)
})
ReviewSchema.pre('remove',function() {
    this.constructor.getAverageRating(this.bootcamp)
})

module.exports=mongoose.model('Review',ReviewSchema);