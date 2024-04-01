import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";


export const register=catchAsyncError(async(req,res,next)=>{
    const {name,email,phone,role,password}=req.body;

    if(!name||!email||!phone||!role||!password){
        return next(new ErrorHandler("please fill complete registration form"));
    }

    const isEmail=await User.findOne({ email });
    if(isEmail){
        return next(new ErrorHandler("email already exists"))
    }    

    //pasting the user name email phone and email and saving it in db
    const user =await User.create({
        name,
        email,
        phone,
        role,
        password,
    });
    sendToken(user,200,res,"User registered successfully");
}); 
//login function
export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password,role}=req.body;   //req url se yeh 3 cheeze extract krlo

    if(!email||!password||!role){
        return next(new ErrorHandler("please provide email , password and role ",400))//400 is the status code
    }

    const user=await User.findOne({email}).select("+password");

    if(!user){
        return next (new ErrorHandler("invalid email or password ",400));
    }

    const isPasswordMatched=await user.comparePassword(password);

    if(!isPasswordMatched){
       return next( new ErrorHandler("invalid email or password ",400));
    }

    if(user.role!==role){
        return next(new ErrorHandler("invalid role of user ",400));
    }

    sendToken(user,200,res,"user logged in successfully");
});



//logout function for user
export const logout=catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token","",{//setting the token generated of the user to null when user logsout
        httpOnly:true,
        expiresIn:new Date(Date.now()),
    }).json({
        success:true,
        message:"user logged out successfully!"
    })
});


//to get the user details
export const getUser=catchAsyncError((req,res,next)=>{
    const user=req.user;

    res.status(200).json({
        success:true,
        user,
    })
})