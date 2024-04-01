import express from "express";
import dotenv from "dotenv";
import cors from "cors";    //used to connect the backend to the frontend of application
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";



const app=express();

dotenv.config({path:"./config/config.env"})


app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods:['GET','PUT','POST','DELETE'],
    credentials:true
}))

app.use(cookieParser());    //used in authorization
app.use (express.json());
app.use(express.urlencoded({extended:true})); 

app.use(fileUpload({ //used for uploading files on your web app
    useTempFiles:true,
    tempFileDir:"/tmp/",
}))

app.use('/api/v1/user',userRouter);
app.use('/api/v1/application',applicationRouter);
app.use('/api/v1/job',jobRouter);

dbConnection();

app.use(errorMiddleware)//error handling middleware should be put at the last of the app.js file 

export default app;