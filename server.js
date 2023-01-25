const express=require("express")
const dotenv=require("dotenv")
const morgan=require("morgan");

// routes

const bootcamps=require("./routes/bootcamps")


dotenv.config({path:"./config/config.env"});

const app=express();


app.use(morgan("dev"));

app.use("/api/v1/bootcamps",bootcamps);

const PORT=process.env.PORT||7000

app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})