import  express  from "express";
import { isAuthorized } from "../middlewares/auth.js";
import { employerGetAllApplications, jobSeekerDeleteApplication, jobseekerGetAllApplications, postApplication } from "../controllers/applicationController.js";

const router=express.Router();

router.get("/employer/getall",isAuthorized,employerGetAllApplications);
router.get("/jobseeker/getall",isAuthorized,jobseekerGetAllApplications);
router.get("/delete/:id",isAuthorized,jobSeekerDeleteApplication);  //adding a variable for application id to be deleted in the req url of delete 
router.post("/post",isAuthorized,postApplication);


export default router;