import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiCRUD } from "../utils/ApiCRUD";
import User from "../models/userModel";

export const signup = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const {name,email,profileImage,password,contact,hall,course,confirmPassword} = req.body
  const feature = new ApiCRUD({name,email,profileImage,password,confirmPassword,contact,hall,course},User)
})