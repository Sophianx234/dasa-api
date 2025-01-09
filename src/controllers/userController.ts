import { NextFunction, Request, Response } from "express";
import fs from "fs";
import cloudinary from "../middleware/cloudinary";
import { upload } from "../middleware/multer";
import User from "../models/userModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { filteredObj } from "../utils/filteredObj";
import { RequestExtended } from "./authController";
import path from 'path'
export type reqQueryType = string | string[] | null;


export const uploadUserPhoto = upload.single("image");

export const resizeUserPhoto = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    if (req.file) {
      const image = path.resolve(req.file.path);
      
      console.log("image", image);

      const uploadResult = await cloudinary.uploader
        .upload(image, {
          folder: "Dasa/users",
          public_id: req.user?.id,
          overwrite: true,
          use_filename: true,
          unique_filename: true,
        })
        .catch((error) => {
          console.log(error);
        });
      fs.unlinkSync(image);

      await User.findByIdAndUpdate(req.user?.id, {
        profileImage: uploadResult?.secure_url,
      });
    }

    next();
  },
);



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

export const getUser = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  req.params.id = req.user?.id
  const user = await User.findById(req.params.id)
  if(!user) return next(new AppError("Could not find user with specified ID: ",400))
    res.status(200).json({
  status: 'success',
  user
    })

})

export const deleteUser = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    req.params.id = req.user?.id;
    const user = await User.findByIdAndUpdate(req.params.id, { active: false },{
      new:true
    });
    if (!user)
      return next(new AppError("can't find user with specified id", 400));
    res.status(400).json({
      status: " success",
      data: null,
    });
  },
);

export const updateUser = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const filteredBody = filteredObj(
      req.body,
      "name",
      "hall",
      "course",
      "contact",
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      filteredBody,
      {
        new: true,
        runValidators: false,
      },
    );
    if (!updatedUser)
      return next(new AppError("can't find user with that id", 400));

    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  },
);
