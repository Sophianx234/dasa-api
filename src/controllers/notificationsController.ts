import { NextFunction, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { RequestExtended } from "./authController";
import Notification from "../models/notifications";
import { AppError } from "../utils/AppError";


export const getAllNotifications = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  const notifications = await Notification.find()
  if(!notifications) return next(new AppError('could not find notifications ',404))
  res.status(200).json({
notifications})
})