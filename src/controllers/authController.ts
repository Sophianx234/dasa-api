import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { LocalStorage } from "node-localstorage";
import User, { userDocument } from "../models/userModel";
import { ApiCRUD } from "../utils/ApiCRUD";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { Email } from "../utils/Email";

type jwtPayload = {
  id: string;
  iat: number;
  exp: number;
};

export type RequestExtended = Request & {
  user?: userDocument;
};

// Extend the Express Request interface

const verifyToken = (token: string, secret: string): Promise<jwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as jwtPayload);
      }
    });
  });
};

function signToken(user: userDocument) {
  const secret: string = process.env.JWT_SECRET as string;
  const expires = process.env.JWT_EXPIRES_IN;

  return jwt.sign({ id: user.id }, secret!, {
    expiresIn: expires,
  });
}
function createSendToken(
  user: any,
  statusCode: number,
  req: Request,
  res: Response,
) {
  const token = signToken(user);
  const cookieExpiry: number = Number(process.env.JWT_COOKIE_EXPIRES_IN);

  res.cookie("jwt", token, {
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 2 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'development'?"none":'lax',
    path: "/",
  });

  user.password = null;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
}
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      firstName,
      lastName,
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
        firstName,
        lastName,
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

    createSendToken(newUser, 200, req, res);
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
    createSendToken(user, 200, req, res);
  },
);

export const restrictTo = function (...roles: string[]) {
  return (req: RequestExtended, res: Response, next: NextFunction) => {
    if (req.user) {
      if (!roles.includes(req.user.role!)) {
        return next(
          new AppError("You are not authorized to access this feature.", 401),
        );
      }
    }
    next();
  };
};

export const protect = async (
  req: RequestExtended,
  res: Response,
  next: NextFunction,
) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError("You are not logged in!.Please login to get access", 401),
    );
  try {
    const secret = process.env.JWT_SECRET;
    const decoded = await verifyToken(token, secret!);
    if (!decoded)
      return next(
        new AppError("You are not logged in!.Please login to get access", 401),
      );
    console.log(decoded);
    const { id, iat } = decoded;
    const currentUser = await User.findById(id);
    if (!currentUser)
      return next(
        new AppError(
          "The user belonging to this token does no longer exist ",
          401,
        ),
      );

    if (!currentUser.isPasswordChanged(iat))
      return next(
        new AppError("User recently changed password please login again", 401),
      );

    req.user = currentUser;

    next();
  } catch (err) {
    return next(new AppError("Jwt Token expired. Please login again!", 400));
  }
};

export const updatePassword = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const { newPassword, currentPassword, confirmPassword } = req.body;
    if (req.user) {
      const user = await User.findById(req.user.id).select("+password");

      if (!user) return next(new AppError("cant find user with that id:", 401));
      if (!(await user.isCorrectPassword(currentPassword)))
        return next(new AppError("incorrect password. please try again!", 401));

      user.password = newPassword;
      user.confirmPassword = confirmPassword;

      await user.save();
      createSendToken(user, 200, req, res);
    }
    next();
  },
);

export const forgotPassword = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return next(
        new AppError("can't find user with the email specified ", 401),
      );

    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}//${req.get("host")}/api/v1/users/reset-password/${resetToken}`;
    try {
      await new Email(user, resetURL).sendPasswordReset();
      res.status(200).json({
        status: "success",
        message: "Token sent to email",
      });
    } catch (err) {
      user.passwordResetExpires = undefined;
      user.passwordResetToken = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError("There was an error sending reset token", 500));
    }
  },
);

export const resetPassword = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return next(new AppError("Token is invalid or expired ", 400));

    const { password, confirmPassword } = req.body;
    user.confirmPassword = confirmPassword;
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, req, res);
  },
);

export const logout = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({
      status: "success",
    });
  },
);
