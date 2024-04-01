import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";


export const getAllJobs=catchAsyncError(async(req,res,next)=>{
    const jobs=await Job.find({expired:false})  //this will return the all the jobs which has expired as false in the mongodb database
    res.status(200).json({
        success:true,
        jobs,   //returning all jobs in response of this method
    })
})


export const postJob=catchAsyncError(async(req,res,next)=>{
    //first we will get the role of the user that is logged in to check whether user is an admin , job seeker or job poster 
    //as only a job poster can post a job so we add authorisation here 
    
    const role=req.user.role;   //getting role from isAuthorized method mein stored user's data
    if(role==="job seeker"){
        return next(new ErrorHandler("Job seeker is not allowed to post new job openings",400));
    }

    const {title,description,category,country,city,location,fixedSalary,salaryFrom,salaryTo}=req.body;//fetching the job details from the req url body 
    //if any detail is missing in req body
    if(!title||!description|| !category||!country||!city|| !location){
        return next(new ErrorHandler("please provide full job details ",400));
    }
    //when both salary range and fixed salary is not provided
    if((!salaryFrom || !salaryTo) && !fixedSalary){
        return next(new ErrorHandler("please either provide fixed salary or salary range ",400));
    }
    //when both salary range and fixed salary is entered 
    if((salaryFrom && salaryTo) && fixedSalary){
        return next(new ErrorHandler("please either provide fixed salary or salary range. you cannot give both ",400)); 
    }

    const postedBy=req.user._id;    //getting the id of user who posted the job
    const job=await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy
    });

    res.status(200).json({
        success:true,
        message:"job posted successfully",
        job //sending job detail also in response 
    })
})

//getting the jobs posted by a particular employer
//to get all the jobs posted by an employer
export const getMyJobs=catchAsyncError(async(req,res,next)=>{
    const role=req.user.role;

    if(role==="job seeker"){
        return next(new ErrorHandler("job seeker is not allowed to view this.",400));
    }

    const myJobs=await Job.find({postedBy : req.user._id}); //to fetch the jobs posted by the current loggedin user's id
    res.status(200).json({
        success:true,
        myJobs   //return the matched jobs in response
    }); 

});

//updating the job by employer
export const updateJob=catchAsyncError(async(req,res,next)=>{
    const role=req.user.role;

    if(role==="job seeker"){
        return next(new ErrorHandler("job seeker is not allowed to update the job",400));
    }

    const {id}=req.params;  //fetching the job id from the req url

    let job=await Job.findById(id);//finding the job with id same as in req url params

    if(!job){
        return next(new ErrorHandler("Oops! job not found! ",404));
    }

    job=await Job.findByIdAndUpdate(id,req.body,{   //findByIdAndUpdate takes 3 parameter 1st-> id ,2nd-> body/content to update with ,3rd->new,runbvalidators,usefindandmodify
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    
    res.status(200).json({
        success:true,
        job,
        message:"job updated successfully"
    });
});

//deleting a job
export const deleteJob=catchAsyncError(async(req,res,next)=>{

    const role=req.user.role;

    if(role==="job seeker"){
        return next(new ErrorHandler("Job seeker is not allowed to delete a job ",400));
    }

    const {id}=req.params;  //fetching id from req url 
    let job=await Job.findById(id);

    if(!job){
        return next(new ErrorHandler("Oops! job not found!",404));
    }

    await job.deleteOne();
    res.status(200).json({
        success:true,
        message:"job deleted successfully"
    })

})