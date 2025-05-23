import { NextFunction, Request, Response } from "express";
import { customError } from "../app";
import { AppError } from "./AppError";

function sendErrorDev(err: customError, res: Response) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err: customError, res: Response) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
}

function handleCastErrorDB(err:any){
  const message = `Invalid ${err.path}: ${err.value}`
  return new AppError(message,400)
}
 
function handleDuplicateFieldsDB(err:any){
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
  const message = `Duplicate field value: ${value}. Please use another value!`
  return new AppError(message,400)

}
function handleValidationErrorDB(err:any){
  const errors = Object.values(err.errors).map((val:any)=>val.message)
  const message = `Invalid input data ${errors.join('. ')}`
  return new AppError(message,400)

}
export function globalError(
  err: customError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = {...err}
    if(err.name === 'CastError') error = handleCastErrorDB(err)
    if(err.code === 1100) error = handleDuplicateFieldsDB(err)
    if(err.name === 'ValidationError') error = handleValidationErrorDB(err)
    sendErrorProd(error, res);
  }
}
