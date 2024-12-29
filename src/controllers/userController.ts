import { NextFunction, Request, Response } from "express";
import User, { userDocument } from "../models/userModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import multer, { FileFilterCallback } from "multer";
import { RequestExtended } from "./authController";
import cloudinary from "../middleware/cloudinary";
export type reqQueryType = string | string[] | null;



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req:RequestExtended, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `user-${req.user?.id}-${uniqueSuffix}.${file.originalname.split('.')[1]}`)
  }
})




const multerFilter = function (
  req: RequestExtended,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) {
  if (file?.mimetype.startsWith("image")) {
    req.file = file;
    cb(null, true);
  } else {
    cb(new AppError("can't upload file. please upload only images", 400));
  }
};

const upload = multer({
  storage
});

export const uploadUserPhoto = upload.single("image");

export const resizeUserPhoto = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
   
   console.log(req.file)
    /* if(req.file){

      const uploadResult = await cloudinary.uploader
      .upload(
        req.file, {
          public_id: 'shoes',
        }
      )
      .catch((error) => {
        console.log(error);
      });
      
      console.log(uploadResult);
    }
 */
    
    next();
  },
);

const filteredObj = function (
  obj: Record<string, any>,
  ...allowedFields: string[]
) {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((el: any) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

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

export const deleteUser = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    req.params.id = req.user?.id;
    const user = await User.findByIdAndUpdate(req.params.id, { active: false });
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
    if (req.file) filteredBody.profileImage = req.file.filename;
    console.log(filteredBody);

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
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
