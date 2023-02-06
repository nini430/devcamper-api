const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
const crypto=require('crypto')


const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please,add a name']
    },
    email:{
        type:String,
        required:[true,'Please,add an E-mail'],
        unique:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please enter valid E-mail']
    },
    role:{
        type:String,
        enum:['user','publisher'],
        required:[true,'Please add a role']
    },
    password:{
        type:String,
        required:[true,'Please, add a password'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now()
    }

})

//encrypt password

UserSchema.pre('save',async function(next) {
    if(!this.isModified('password')) {
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();

})

// generate token

UserSchema.methods.generateJwtToken=function() {
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
}

//check for password

UserSchema.methods.matchPassword=async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

//generate token and hash it

UserSchema.methods.generatePasswordToken=function() {
    const resetToken=crypto.randomBytes(20).toString('hex');
    //hash the token
    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire=Date.now()+10*60*1000;

    return resetToken;
}



module.exports=mongoose.model('User',UserSchema);
