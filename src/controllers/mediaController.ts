import { NextFunction, Request, Response } from "express";
import { Media } from "../models/mediaModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { ApiCRUD } from "../utils/ApiCRUD";

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

export const getMedia = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(new AppError("can't find media with that id", 404));
    const feature = new ApiFeatures(req.query, Media.find({ _id: id }))
      .filter()
      .sort()
      .limit();
    const media = await feature.query;
    if (!media.length) return next(new AppError("can't find media ", 404));
    res.status(200).json({
      status: "success",
      data: {
        media,
      },
    });
  },
);

export const updateMedia = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fileUrl, fileType, fileSize } = req.body;
    const {id} = req.params
    const feature = new ApiCRUD({ fileUrl, fileType, fileSize },Media,id)
    const media = await feature.update()
    if(!media) return next(new AppError("can't find media with id",404))
        res.status(200).json({
    status: 'success',
    data:{
        media
    }
    })
  },
);
