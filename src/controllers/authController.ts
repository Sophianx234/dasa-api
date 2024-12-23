import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiCRUD } from "../utils/ApiCRUD";
import User from "../models/userModel";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { NumberSchemaDefinition } from "mongoose";

function signToken(next:NextFunction,user: any) {
  const secret: string | undefined = process.env.JWT_SECRET;
  const expires = process.env.JWT_EXPIRES_IN;
  if (!secret) return next(new AppError("can't find jwt secret", 400));
  return jwt.sign({ id: user.id }, secret, {
    expiresIn: expires,
  });
}
function createSendToken(user:any,statusCode:number,req:Request,res:Response,next:NextFunction) {
  const token = signToken(next,user)
  const cookieExpiry:number|undefined = Number(process.env.JWT_COOKIE_EXPIRES_IN)
  if(!cookieExpiry) return next(new AppError('cookie expiry is not defined',400))
  res.cookie('jwt',token,{
    expires: new Date(
      Date.now()+ cookieExpiry *24*60*60*1000

    ),
    httpOnly:true

  })

  user.password = null
  res.status(statusCode).json({
    status: 'success',
    token,
    data:{
      user
    }
  })



}
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

    createSendToken(newUser,200,req,res,next)
  },
);
