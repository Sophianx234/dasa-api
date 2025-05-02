import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { RequestExtended } from "./authController";
import Event from "../models/eventsModel";
import { AppError } from "../utils/AppError";
import cloudinary from "../middleware/cloudinary";
import fs from 'fs'
import { UploadApiResponse } from "cloudinary";


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

export const createEvent = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  console.log(req.file)
  if(req.file){
    const image = req.file.path;
          const uploadResult = await cloudinary.uploader
            .upload(image, {
              folder: "Dasa/media/events",
              overwrite: true,
              use_filename: true,
            })
            .catch((error) => {
              console.log(error);
            });
          fs.unlinkSync(image);
          console.log('test',uploadResult)
          console.log('xsg',req.body)
    const event = await Event.create({...req.body,eventImage:(uploadResult as UploadApiResponse).secure_url})
    if(!event) return next(new AppError('could not create event ',400))
      res.status(200).json({
    event})
  }
  else{
    const event = await Event.create({...req.body})
    if(!event) return next(new AppError('could not create event ',400))
      res.status(200).json({
    event})

  }

})