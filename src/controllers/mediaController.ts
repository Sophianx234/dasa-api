import { NextFunction, Request, Response } from "express";
import { Media } from "../models/mediaModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export const getAllMedia = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    const feature = new ApiFeatures(req.query, Media?.find())
    .search()
      .filter()
      .sort()
      .limit()
      .pagination();
    const media = await feature.query;
    if (!media.length)
      return next(new AppError("can't find media related files", 404));
    res.status(200).json({
      status: "success",
      numMedia: media.length,
      data: {
        media,
      },
    });
  },
);
