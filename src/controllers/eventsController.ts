import { NextFunction, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { RequestExtended } from "./authController";
import Event from "../models/eventsModel";
import { AppError } from "../utils/AppError";



export const getAllEvents = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  const events = await Event.find()
  if(!events) return next(new AppError('could not find events',404))
  res.status(200).json({
events
  })
})
export const removeEvent = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  const {id} = req.params
  const event = await Event.findByIdAndDelete(id)
  if(!event) return next(new AppError('could not find event with specified id',404))
  res.status(200).json({
status:'success',
data:null
  })
})
export const updateEvent = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  const {id} = req.params
  const event = await Event.findByIdAndUpdate(id,req.body)
  if(!event) return next(new AppError('could not find event with specified id',404))
  res.status(200).json({
status:'success',
event
  })
})