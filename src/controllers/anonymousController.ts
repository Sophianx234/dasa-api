import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiFeatures } from "../utils/ApiFeatures";
import { AppError } from "../utils/AppError";
import { ApiCRUD } from "../utils/ApiCRUD";
import Anonymous from "../models/AnonymousModel";

export const getAllAnonymous = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const feature = new ApiFeatures(req.query, Anonymous.find())
      .filter()
      .sort()
      .limit();
    const anonymous = await feature.query;
    if (!anonymous.length)
      return next(new AppError("can't fetch anonymous messages", 404));

    res.status(200).json({
      status: "success",
      numAnonymous: anonymous.length,
      data: {
        anonymous,
      },
    });
  },
);

export const sendAnonymous = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;
    const feature = new ApiCRUD({ message }, Anonymous);
    const anonymous = await feature.create();
    if (!anonymous) return next(new AppError("can't create anonymous", 404));
    res.status(200).json({
      status: "success",
      data: {
        anonymous,
      },
    });
  },
);

export const deleteAnonymous = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(new AppError("can't find id", 404));
    const feature = new ApiCRUD(req.body, Anonymous, id);
    const deleteAnonymous = await feature.delete();
    if (!deleteAnonymous)
      return next(new AppError("can't find id or message", 404));
    res.status(200).json({
      status: "success",
      data: null,
    });
  },
);
