import { NextFunction, Request, Response } from "express";
import { customError } from "../app";

function sendErrorDev(err:customError,res:Response){
    if(err.isOperational){

        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
            
        });
    } else{
        res.status(500).json({
            status: 'error',
            message: 'something went wrong',
            
        });

    }
}
function sendErrorProd(err:customError,res:Response){
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        

      });

}

export function globalError(err: customError, req: Request, res: Response, next: NextFunction){
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,res)

        
    } else if (process.env.NODE_ENV === 'production'){
        sendErrorProd(err,res)
        

    }
    
  }