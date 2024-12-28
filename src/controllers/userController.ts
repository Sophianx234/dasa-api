import { NextFunction, Request, Response } from "express";
import User, { userDocument } from "../models/userModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import multer, { FileFilterCallback } from "multer";
import { RequestExtended } from "./authController";
import sharp from "sharp";
import axios from "axios";
import FormData from "form-data";
export type reqQueryType = string | string[] | null;



const bufferToBlob = (buffer: Buffer, mimeType: string) => {
  return new Blob([buffer], { type: mimeType });
};

const multerStorage = multer.memoryStorage();

const multerFilter = function (
  req: RequestExtended,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) {
  console.log(file);
  req.file = file;
  if (file?.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("can't upload file. please upload only images", 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("profileImage");

export const resizeUserPhoto = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    if (!req.file) return next();
    if (req.user) {
      req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
      const resizedBuffer = await sharp(req.file.buffer)
        .resize(500, 500, {
          fit: "fill",
        })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toBuffer();
      const resizedBlob = bufferToBlob(resizedBuffer,'image/jpeg')
      const formData = new FormData();
      formData.append("image", resizedBlob, req.file.filename); // Append the image buffer to FormData
      const api_key = process.env.API_KEY_IMAGE_BB;
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${api_key}`,formData,{
          headers: {
            ...formData.getHeaders()
          }
        }
      );
    }
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
