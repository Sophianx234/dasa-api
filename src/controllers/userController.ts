import { NextFunction, Request, Response } from "express";
import fs from "fs";
import cloudinary from "../middleware/cloudinary";
import User, { userDocument } from "../models/userModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { filteredObj } from "../utils/filteredObj";
import { jwtPayload, RequestExtended, verifyToken } from "./authController";
export type reqQueryType = string | string[] | null;

// export const uploadUserPhoto = upload.single("image");

export const resizeUserPhoto = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    if (req.file) {
      const image = req.file.path;

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

    res.status(200).json({
      status: "success",
    });
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
        totalUsers: (users as userDocument[]).length,
        users,
      });
  },
);

export const getMe = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    req.params.id = req.user?.id;
    const user = await User.findById(req.params.id);
    if (!user)
      return next(new AppError("Could not find user with specified ID: ", 400));
    res.status(200).json({
      status: "success",
      user,
    });
  },
);

export const getUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
  const {id} = req.params
  if(!id) return next(new AppError('Could not find Id',404))
    const user = await User.findById(id)
  if(!user) return next(new AppError('Could not find user with specified ID:',400))

    res.status(200).json({
      user
    })
})

export const deleteMe = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    req.params.id = req.user?.id;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      {
        new: true,
      },
    );
    if (!user)
      return next(new AppError("can't find user with specified id", 400));
    res.status(400).json({
      status: " success",
      data: null,
    });
  },
);
export const deleteUser = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      {
        new: true,
      },
    );
    if (!user)
      return next(new AppError("can't find user with specified id", 400));
    res.status(200).json({
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
      "sex",
      'role'
    );
    console.log('texkd123',req?.params?.id,req.body.role)
    

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: false,
      },
    );
    if (!updatedUser)
      return next(new AppError("can't find user with that id", 400));
console.log('updated',updatedUser)
    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  },
);
export const updateCurrentUser = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const filteredBody = filteredObj(
      req.body,
      "name",
      "hall",
      "course",
      "contact",
      "sex",
      'role'
    );
    

    const updatedUser = await User.findByIdAndUpdate(
      req?.user?.id,
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

export const checkUserIsAuthenticated = catchAsync(async (req:RequestExtended,res:Response,next:NextFunction)=>{
  console.log(req.cookies)
  if(!req.cookies.jwt || !req.headers.authorization?.split(" ")[1] ) res.status(200).json({
    isAuthenticated:false
  })
  console.log('authorization',req.headers.authorization?.split(' ')[1])
    
    let token 
    if(req.cookies.jwt){
      token = req.cookies.jwt
    } else if(req.headers.authorization?.split(" ")[1]){
      token = req.headers.authorization?.split(" ")[1]

    }
    const secret = process.env.JWT_SECRET
    const decoded:jwtPayload =  await verifyToken(token,secret!)
    const {id} = decoded
    const user = await User.findById(id)
    console.log('user',user)
    if(user){
      res.status(200).json({
        isAuthenticated: true,
        user
      })

    } else{
      res.status(200).json({
        isAuthenticated:false
      })
    }

})
