import  express  from "express";
import { getUser, login, logout, register } from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/auth.js";

const router=express.Router();
//creating routes
router.post("/register",register);
router.post("/login",login);
router.get("/logout",isAuthorized,logout);  //adding isAuthorized as a middleware in route
router.get("/getuser",isAuthorized,getUser);
export default router;

