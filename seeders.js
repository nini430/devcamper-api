const fs = require('fs');
const colors = require('colors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// load environment variables

dotenv.config({ path: './config/config.env' });

// load model

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User=require('./models/User')
const Review=require('./models/Review')

// load db connection

mongoose.connect(process.env.MONGO_URI);

// read JSON files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users=JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))

const reviews=JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'))
// importData function

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data imported'.green.inverse);
  } catch (err) {
    console.log(err);
  }
};

// delete Data function

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data destroyed'.red.inverse);
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
