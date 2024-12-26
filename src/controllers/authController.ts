import { NextFunction,  Request,  Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiCRUD } from "../utils/ApiCRUD";
import User, { userDocument } from "../models/userModel";
import { AppError } from "../utils/AppError";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { Email } from "../utils/Email";

type jwtPayload = {
  id: string;
  iat: number;
  exp: number;
};

type RequestExtended = Request &{
  user?:userDocument
}

// Extend the Express Request interface

const verifyToken = (token: string, secret: string): Promise<jwtPayload> => {
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
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
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


export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError("can't find username or password", 400));
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.isCorrectPassword(password)))
      return next(new AppError("Invalid email or password", 400));
    createSendToken(user, 200, req, res, next);
  },
);

export const restrictTo = function (...roles: string[]) {
  return (req: RequestExtended, res: Response, next: NextFunction) => {
    if(req.user){

      if (!roles.includes( req.user.role!)) {
        return next(
          new AppError("You are not authorized to access this feature.", 401),
        );
      }
      
    }
    next();
  };
};

export const protect = async(req:RequestExtended,res:Response,next:NextFunction)=>{
  let token
  if(req.cookies.jwt){
    token = req.cookies.jwt

  }
  if(!token) return next(new AppError("You are not logged in!.Please login to get access",401))
  const secret = process.env.JWT_SECRET
  const decoded = await verifyToken(token,secret!)
  console.log(decoded)
  const {id,iat} = decoded
  const currentUser = await User.findById(id)
  if(!currentUser) return next(new AppError("The user belonging to this token does no longer exist ",401))
  
  if (!currentUser.isPasswordChanged(iat)) return next (new AppError("User recently changed password please login again",401))

  req.user = currentUser

  next()
  



}

export const updatePassword = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  const {newPassword,currentPassword,confirmPassword} = req.body
  if(req.user){

    const user = await User.findById(req.user.id).select('+password')

    if(!user) return next(new AppError("cant find user with that id:",401))
      if(!(await user.isCorrectPassword(currentPassword))) return next(new AppError("incorrect password. please try again!",401))

      user.password = newPassword
      user.confirmPassword = confirmPassword

      await user.save()
      createSendToken(user,200,req,res,next)
      
    
  }
  next()
  })


  export const forgotPassword = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
    const {email}= req.body
    const user = await User.findOne({email})
    if(!user) return next(new AppError("can't find user with the email specified ",401))

      const resetToken = user.createPasswordResetToken()
      await user.save({validateBeforeSave:false})

      try{
        const resetURL = `${req.protocol}//${req.get('host')}/api/v1/users/forgot-password/${resetToken}`
        await new Email(user,resetURL).sendPasswordReset()
        res.status(200).json({
          status:'success',
          message: 'Token sent to email'
        })

      }catch(err){
        user.passwordResetExpires = undefined
        user.passwordResetToken = undefined
        await user.save({validateBeforeSave:false})
        return next(new AppError("There was an error sending reset token",500))

      }

  })
