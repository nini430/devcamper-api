const fs=require("fs");
const colors=require("colors")
const mongoose=require("mongoose")
const dotenv=require("dotenv")


// load environment variables

dotenv.config({path:"./config/config.env"});

// load model

const Bootcamp=require("./models/Bootcamp")

// load db connection

mongoose.connect(process.env.MONGO_URI);


// read JSON files

const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,"utf-8"));

// importData function

const importData=async()=>{
    try{
    await Bootcamp.create(bootcamps);
    console.log("Data imported".green.inverse)
    }catch(err) {
        console.log(err);
    }
}

// delete Data function

const deleteData=async()=>{
    try{
        await Bootcamp.deleteMany()
        console.log("Data destroyed".red.inverse)
    }catch(err) {
        console.log(err);
    }
}


if(process.argv[2]==="-i") {
    importData()
}else if(process.argv[2]==="-d") {
    deleteData()
}



