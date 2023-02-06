const mongoose = require('mongoose');
const slugify=require("slugify");

const geocoder=require("../utils/geocoder");

const BootcampSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add bootcamp name'],
    unique: true,
    trim: true,
    maxlength: [50, 'bootcamp name should not be more than 50 characters long'],
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please,add a description'],
    maxlength: [
      500,
      'Bootcamp description should not be more than 500 characters long',
    ],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please provide valid http or htpps url',
    ],
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number should not be more than 20 characters long'],
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide valid E-mail address',
    ],
  },
  address: {
    type: String,
    required: [true, 'Please provide an address'],
  },
  averageCost: Number,
  averageRating: {
    type: Number,
    min: [1, 'Min Average Rating is 1'],
    max: [10, 'Max average rating is 10'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      index: '2dspace',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },

  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX',
      'Data Science',
      'Business',
      'Other',
    ],
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  housing: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user:{
    type:mongoose.Types.ObjectId,
    required:true,
    ref:'User'
  },
},{
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
});



BootcampSchema.virtual('courses',{
  ref:'Course',
  localField:'_id',
  foreignField:'bootcamp'
})

// create slug from name
BootcampSchema.pre("save",function(next) {
    this.slug=slugify(this.name,{lower:true});
    next();
})

BootcampSchema.pre('remove',async function(next) {
  console.log(`Courses are about to be removed from the bootcamp ${this._id}`)
    await this.model('Course').deleteMany({bootcamp:this._id})
    next();
})

// geocode & create location field

BootcampSchema.pre("save",async function(next) {
    const loc=await geocoder.geocode(this.address);
    this.location={
      type:"Point",
      coordinates:[loc[0].longitude,loc[0].latitude],
      formattedAddress:loc[0].formattedAddress,
      street:loc[0].streetName,
      city:loc[0].city,
      state:loc[0].stateCode,
      zipCode:loc[0].zipcode,
      country:loc[0].countryCode

    }

    // remove the address
    this.address=undefined;
    next()
})

module.exports = mongoose.model('Bootcamp', BootcampSchema);
