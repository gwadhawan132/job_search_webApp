import mongoose from "mongoose";
import validator from "validator";

const applicationSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:3,
        maxLength:25
    },
    email:{
        type:String,
        validator:[validator.isEmail,"please provide an valid email"],
        required:true
    },
    coverLetter:{
        type:String,
        required:[true,"please provide cover letter"]
    },
    phone:{
        type:Number,
        required:[true,"enter phone number"]
    },
    address:{
        type:String,
        required:[true,"please provide your address"]
    },
    resume:{    //to upload the resume file from applicant computer we do this
        public_id:{
            type:String,
            //required:true 
        },
        url:{
            type:String,
            //required:true
        }
    },
    applicantId:{   //to get the id of applicant 
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:String,
            enum:["job seeker"],
            required:true
        }
    },
    employerId:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:String,
            enum:["employer"],
            required:true
        }
    }
});

export const Application=mongoose.model("Application",applicationSchema);