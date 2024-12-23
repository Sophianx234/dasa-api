import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiCRUD } from "../utils/ApiCRUD";
import User from "../models/userModel";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      email,
      profileImage,
      password,
      contact,
      hall,
      course,
      confirmPassword,
    } = req.body;
    const feature = new ApiCRUD(
      {
        name,
        email,
        profileImage,
        password,
        confirmPassword,
        contact,
        hall,
        course,
      },
      User,
    );
    const newUser = await feature.create();
    if (!newUser) return next(new AppError("can't create user ", 400));
    const secret:string|undefined = process.env.JWT_SECRET;
    if(!secret) return next(new AppError("can't find jwt secret",400))
    
    const token = jwt.sign({ id: newUser.id }, secret, {
      expiresIn: "1h",
    });
    console.log(token)
    res.status(200).json({
      status: "success",
      token,
      data: {
        newUser,
      },
    });
  },
);
