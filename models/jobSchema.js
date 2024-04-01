import mongoose from "mongoose";

const jobSchema=new mongoose.Schema({

    title:{
        type:String,
        required:true,
        minLength:[3,"Min 3 characters are required for title"],
        maxLength:[50,"job title cannot exceed 50 characters"]
    },
    description:{
        type:String,
        required:[true,"please provide job description "],
        minLength:[3,"Min 3 characters are required for job description"],
        maxLength:[350,"job description cannot exceed 350 characters"]
    },
    category:{
        type:String,
        required:[true,"job category is required"],

    },
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        requried:true
    },
    location:{
        type:String,
        required:true
    },
    fixedSalary:{
        type:Number,
        minLength:[4,"salary is not upto industry standards"],
        maxLength:[7,"salary cannot be that high"]
    },
    salaryFrom:{
        type:Number,
        minLength:[4,"salary is not upto industry standards"],
        maxLength:[7,"salary cannot be that high"]

    },
    salaryTo:{
        type:Number,
        minLength:[4,"salary is not upto industry standards"],
        maxLength:[7,"salary cannot be that high"]
    },
    expired:{
        type:Boolean,
        default:false
    },
    jobPostedOn:{
        type:Date,
        default:Date.now(),
    },
    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    }

});

export const Job=mongoose.model("job",jobSchema);