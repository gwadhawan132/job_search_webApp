import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[3,"name must contain 3 alphabets"],
        maxLength:[30,"name must no be longer than 30 alphabets"]
    },
    email:{
        type:String,
        required:[true, "please provide your email"],
        validate:[validator.isEmail,"please provide a valid email"]
    },
    phone:{
        type:Number,
        required:[true,"please provide your contact number"]
    },
    password:{
        type:String,
        required:[true,"please provide your password"],
        minLength:[8,"password must contain 8 characters"],
        maxLength:[30,"password must not be longer than 30 characters"],
        Select:true
    },
    role:{
        type:String,
        required:[true,"please provide your role"],
        enum:['job seeker','employer'],
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    }
})

//hashing the password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){//if the password is not changed or modified then move to the next action
        next();
    }

    this.password=await bcrypt.hash(this.password,10);

});

//comparing the password(entered & saved in database password)
 userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
 };

//generating a json web token for authorization
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id} , process.env.JWT_SECRET_KEY , {
        expiresIn:process.env.JWT_EXPIRE,
        
    });
};

export const User=mongoose.model("User",userSchema);
