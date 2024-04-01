import  express  from "express";
import { deleteJob, getAllJobs, getMyJobs, postJob, updateJob } from "../controllers/jobController.js";
import { isAuthorized } from "../middlewares/auth.js";

const router=express.Router();

router.get("/getall",getAllJobs);

//first we will get the role of the user that is logged in to check whether user is an admin , job seeker or job poster 
//as only a job poster can post a job so we will do authorisation here 
router.post("/post",isAuthorized,postJob);

router.get("/getmyjobs",isAuthorized,getMyJobs);
router.put("/update/:id",isAuthorized,updateJob);   //sending the job id as params in the url 
router.delete("/delete/:id",isAuthorized,deleteJob);    //sending the job id of the job to be deleted.

export default router;
