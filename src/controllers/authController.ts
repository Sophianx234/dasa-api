import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiCRUD } from "../utils/ApiCRUD";
import User from "../models/userModel";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { promisify } from "util";

type jwtPayload = {
  id: string;
  iat: number;
  exp: number;
};
const verifyToken = (
  token: string,
  secret: string,
): Promise<jwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        if (!decoded) throw new Error("decoded value is undefined");
        resolve(decoded as jwtPayload);
      }
    });
  });
};

function signToken(next: NextFunction, user: any) {
  const secret: string | undefined = process.env.JWT_SECRET;
  const expires = process.env.JWT_EXPIRES_IN;
  if (!secret) return next(new AppError("can't find jwt secret", 400));
  return jwt.sign({ id: user.id }, secret, {
    expiresIn: expires,
  });
}
function createSendToken(
  user: any,
  statusCode: number,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = signToken(next, user);
  const cookieExpiry: number | undefined = Number(
    process.env.JWT_COOKIE_EXPIRES_IN,
  );
  if (!cookieExpiry)
    return next(new AppError("cookie expiry is not defined", 400));
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + cookieExpiry * 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  user.password = null;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
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

    createSendToken(newUser, 200, req, res, next);
  },
);

export const isLoggedIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies);
    if (req.cookies.jwt) {
      const secret = process.env.JWT_SECRET;
      if (!secret) return;
      const decoded = await verifyToken(req.cookies.jwt, secret);
      const { id } = decoded;
      console.log(id)
      const currentUser = await User.findById(id)
         if(!currentUser) return next()
    }
    next();
  },
);

export const login = catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
  const {name,password} = req.body
  if(!name || !password) return next(new AppError("can't find username or password",400))
})
