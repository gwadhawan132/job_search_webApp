import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName:"JOB_SEEKING"    //to give name to the mongodb database 
    }).then(()=>{
        console.log('connected to database');
    }).catch((err)=>{
        console.log(`errror aaagaya bhai: ${err}`);
    })
};