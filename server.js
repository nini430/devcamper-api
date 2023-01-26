const express=require("express")
const dotenv=require("dotenv")
const morgan=require("morgan");
const colors=require("colors");
const connectDB=require("./config/db")

// routes

const bootcamps=require("./routes/bootcamps")



dotenv.config({path:"./config/config.env"});


connectDB();

const app=express();


app.use(morgan("dev"));

app.use("/api/v1/bootcamps",bootcamps);

const PORT=process.env.PORT||7000

const server=app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

process.on("unhandledRejection",(err,promise)=>{
    console.log(`Error ${err.message}`.red);
    server.close(()=>process.exit(1));
})