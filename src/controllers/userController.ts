import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import multer, { FileFilterCallback } from 'multer'
import { RequestExtended } from "./authController";
export type reqQueryType = string | string[] | null;
const multerStorage = multer.memoryStorage()

const multerFilter =  function(req:RequestExtended,file:Express.Multer.File,cb:FileFilterCallback){
  if(file?.mimetype.startsWith('image')){
    cb(null,true)
  }else{

    
     cb(new AppError("can't upload file. please upload only images",400))
  }

}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,

})

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new ApiFeatures(req.query, User.find())
      .filter()
      .sort()
      .limit()
      .pagination();
    const users = await features.query;
    if (!users) return next(new AppError("can't find users", 404));
    res.status(200).json({
      status: "success",
      totalUsers: users.length,
      data: {
        users,
      },
    });
  },
);

