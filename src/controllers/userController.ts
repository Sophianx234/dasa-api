import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import multer, { FileFilterCallback } from 'multer'
import { RequestExtended } from "./authController";
import sharp from 'sharp'
export type reqQueryType = string | string[] | null;
const multerStorage = multer.memoryStorage()

const multerFilter =  function(req:RequestExtended,file:Express.Multer.File,cb:FileFilterCallback){
  if(req.file?.mimetype.startsWith('image')){
    cb(null,true)
  }else{

    
     cb(new AppError("can't upload file. please upload only images",400))
  }

}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,

})

const uploadUserPhoto = upload.array('photo')

const resizeUserPhoto = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  if(!req.file) return next()
    if(req.user){

      req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
      await sharp(req.file.buffer).resize(500,500,{
        fit:'fill'
      }).toFormat('jpeg').jpeg({quality:90}).toFile(`public/img/users/${req.file.filename}`)
    }
    next()
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


export const deleteUser = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  req.params.id = req.user?.id
  const user = await User.findByIdAndUpdate(req.params.id,{active:false})
  if(!user) return next(new AppError("can't find user with specified id",400))
  res.status(400).json({
    status:' success',
    data: null
  })


})

export const updateUser = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  const {name,hall,contact}
})

