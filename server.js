const express=require("express")
const dotenv=require("dotenv")
const morgan=require("morgan");
const colors=require("colors");
const cookieParser=require('cookie-parser');
const path=require('path')
const errorHandler=require("./middleware/error")
const connectDB=require("./config/db")
const fileupload=require('express-fileupload')

dotenv.config({path:"./config/config.env"});
// routes

const bootcamps=require("./routes/bootcamps")
const courses=require("./routes/courses")
const auth=require('./routes/auth')
const users=require('./routes/users')
const reviews=require('./routes/reviews')






connectDB();

const app=express();

// bodyparser
app.use(express.json())
app.use(cookieParser());
  

app.use(morgan("dev"));

app.use(express.static(path.join(__dirname,'public')))

app.use(fileupload())

app.use("/api/v1/bootcamps",bootcamps);
app.use("/api/v1/courses",courses);
app.use('/api/v1/auth',auth);
app.use('/api/v1/users',users);
app.use('/api/v1/reviews',reviews)

app.use(errorHandler);

const PORT=process.env.PORT||7000

const server=app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

process.on("unhandledRejection",(err,promise)=>{
    console.log(`Error ${err.message}`.red);
    server.close(()=>process.exit(1));
})