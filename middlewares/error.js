//for error handling
class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode=statusCode;
    }
}

export const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message||'internal server error';
    err.statusCode=err.statusCode|| 500;

    if(err.name=='CaseError'){
        const message=`resource not found . invalid ${err.path}`;
        err=new ErrorHandler(message,400);
    }

    if(err.name=='CaseError'){
        const message=`resource not found . invalid ${err.path}`;
        err=new ErrorHandler(message,400);
    }

    if(err.code==11000){//error which occurs from database will give a code of 110000
        const message=`duplicate ${Object.keys(err.keyValue)} entered`;
        err=new ErrorHandler(message,400);
    }

    if(err.name=='JsonWebTokenError'){
        const message=`JSON web token is invalid , try again.`;
        err=new ErrorHandler(message,400);
    }

    if(err.name=='TokenExpiredError'){
        const message=`Json web token is expired. try again. `;
        err=new ErrorHandler(message,400);
    }  

    //returning the response back from the errorHandler function 
    return res.status(err.statusCode).json({
        success:false,
        message:err.message,
    });
};

export default ErrorHandler;