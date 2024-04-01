import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from 'cloudinary';
import { Job } from "../models/jobSchema.js";

//to get all the application to an employer so that he can see the applications for all the jobs posted by that employer
export const employerGetAllApplications=catchAsyncError(async(req,res,next)=>{
    const role=req.user.role;

    if(role==="job seeker"){
        return next(new ErrorHandler("Job seeker is not allowed to acess this resource",400));
    }

    const id=req.user._id;
    const applications=await Application.find({'employerId.user':id});

    res.status(200).json({
        success:true,
        applications
    })
})

//to get all the applications of a job seeker to which he has applied 
export const jobseekerGetAllApplications=catchAsyncError(async(req,res,next)=>{
    
    const role=req.user.role;
    if(role==="employer"){
        return next(new ErrorHandler("employer cannot see all the applications of a job seeker/candidate ",400));
    }

    //getting the job seeker id
    const id=req.user._id;

    const applications=await Application.find({'applicantId.user':id}); //if the applicantid.user of an application matches the id of the current logged in user then show that application to the user

    res.status(200).json({
        success:true,
        applications
    })

})

//deleting an application
//we are not letting an employer delete any job application
//ONLY an JoB seeker can delete his application when he/she wants
export const jobSeekerDeleteApplication=catchAsyncError(async(req,res,next)=>{
    
    const role=req.user.role;

    if(role==="employer"){
        return next(new ErrorHandler("Employer cannot delete any job application ",400));
    }

    //getting the application id to be deleted from the url req params
    const id=req.params;
    //getting the application with the coressponding id
    const application=await Application.findById(id);

    if(!application){
        return next(new ErrorHandler("Oops! application not found !",404));
    }
    //deleting the application
    await application.deleteOne();

    res.status(200).json({
        success:true,
        message:"application deleted successfully"
    });
});


//POSTING AN APPLICATION
export const postApplication=catchAsyncError(async(req,res,next)=>{
    const role=req.user.role;

    if(role==="employer"){
        return next(new ErrorHandler("employer cannot post an job application! ",400));
    }   
    
    //if the resume file is not provided by the job seeker in an application
    //if(!req.files || Object.keys(req.files).length==0){
    ///   return next(new ErrorHandler("resume file required"));
   // }


    //const {resume}=req.files;
   // const allowedFormats = ['image/png','image/jpg','image/webp'];// allowed formats for uploading resumee files

   // if(!allowedFormats.includes(resume.mimetype)){  //image/png mein -> png is the mimetype
   //     return next(new ErrorHandler("Invalid file type! please upload resume in a png,jpg,webp format",400))
  //  }

    //to upload the resume using cloudinary to attach it with the application
   // const cloudinaryResponse=await cloudinary.uploader.upload(
    //    resume.tempFilePath
  //  );

    //if the cloudinary is not able to upload the resume
   // if(!cloudinaryResponse || cloudinaryResponse.error){
      //  console.log("cloudinary error: ",cloudinaryResponse.error || "Unknown Cloudinary error");

      //  return next(new ErrorHandler("failed to upload resume",500))
  //  }

    const {name,email,coverLetter,phone,address,jobId}=req.body;    //fetching the application data from the req url body
    //fetching the applicant id 
    const applicantId={
        user:req.user._id,
        role:"job seeker"
    }
    //if the job id passed in the req url body doesnt exsist in the mongon database
    if(!jobId){
        return next(new ErrorHandler("Job not found ",404));
    }

    const jobDetails=await Job.findById(jobId);

    if(!jobId){
        return next(new ErrorHandler("Job not found ",404));
    }

    //fetching the employer id 
    const employerId={
        user:jobDetails.postedBy,
        role:"employer"
    }

    if(!name|| !email || !coverLetter || !phone || !address || !applicantId || !employerId){
        return next(new ErrorHandler("please fill all the fields of application",400));
    }

    const application=await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantId,
        employerId
       // resume:{    //to add the resume in the application we do this
        //    public_id:cloudinaryResponse.public_id,
       //     url:cloudinaryResponse.secure_url 
       // }
    });

    res.status(200).json({
        success:true,
        message:"application submitted",
        application
    });
 
});






