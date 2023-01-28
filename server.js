const express=require("express")
const dotenv=require("dotenv")
const morgan=require("morgan");
const colors=require("colors");
const errorHandler=require("./middleware/error")
const connectDB=require("./config/db")

dotenv.config({path:"./config/config.env"});
// routes

const bootcamps=require("./routes/bootcamps")






connectDB();

const app=express();

// bodyparser
app.use(express.json())
  

app.use(morgan("dev"));

app.use("/api/v1/bootcamps",bootcamps);

app.use(errorHandler);

const PORT=process.env.PORT||7000

const server=app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

process.on("unhandledRejection",(err,promise)=>{
    console.log(`Error ${err.message}`.red);
    server.close(()=>process.exit(1));
})