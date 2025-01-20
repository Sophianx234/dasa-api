import { NextFunction, Request, Response } from "express";
import { upload } from "../middleware/multer";
import { Media } from "../models/mediaModel";
import { ApiCRUD } from "../utils/ApiCRUD";
import { ApiFeatures } from "../utils/ApiFeatures";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { uploadImages } from "../utils/uploadImages";
import { RequestExtended } from "./authController";
import cloudinary from "../middleware/cloudinary";

export type multerFile = Express.Multer.File;

export const uploadMedia = upload.array("file");

export const uploadMediaToCloud = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const uploadResults = await uploadImages(req, "Dasa/media");
    if (!uploadResults)
      return next(new AppError("please select images to be uploaded", 400));
    console.log("uploaded Media: ", uploadResults);
    uploadResults?.map(async (result) => {
      await Media.create(result);
    });
    res.status(200).json({
      status: "success",
      message: "uploaded successfully",
    });
  },
);

export const getAllMedia = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.query);
    const feature = new ApiFeatures(req.query, Media?.find().sort({ _id: -1 }))
      .search()
      .filter()
      .sort()
      .limit()
      .pagination();
    const media = await feature.query;

    /* const media = await cloudinary.api.resources(
      { type: 'upload', resource_type: 'image', max_results: 500 }, // Filter for images
      (error, result) => {
        if (error) {
          console.error('Error fetching images:', error);
        } else {
          console.log('Images:', result.resources);
        }
      }
    ); */

    /* const media = await cloudinary.api.resources({
          resource_type: "video",
          max_results: 50,        // 
        }) */
    if (!media)
      return next(new AppError("can't find media related files", 404));
    res.status(200).json({
      status: "success",
      numMedia: media.length,

      media,
    });
  },
);
export const getAllImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const feature = new ApiFeatures(
      req.query,
      Media.find({ format: "image" }).sort({ _id: -1 }),
    )
      .filter()
      .sort()
      .limit()
      .pagination();

    const images = await feature.query;
    if (!images) return next(new AppError("can't find images", 404));

    res.status(200).json({
      status: "success",
      numImages: images.length,
      images,
    });
  },
);
export const getAllVideos = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const feature = new ApiFeatures(req.query, Media.find({ format: "mp4" }))
      .filter()
      .sort()
      .limit()
      .pagination();

    const videos = await feature.query;
    if (!videos) return next(new AppError("can't find images", 404));

    res.status(200).json({
      status: "success",
      numVideos: videos.length,
      videos,
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

export const createMedia = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const feature = new ApiCRUD(req.body, Media);
    const newMedia = await feature.create();
    if (!newMedia) return next(new AppError("can't create new media", 404));
    res.status(200).json({
      status: "success",
      data: {
        newMedia,
      },
    });
  },
);
export const updateMedia = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fileUrl, fileType, fileSize } = req.body;
    const { id } = req.params;
    const feature = new ApiCRUD({ fileUrl, fileType, fileSize }, Media, id);
    const media = await feature.update();
    if (!media) return next(new AppError("can't find media with id", 404));
    res.status(200).json({
      status: "success",
      data: {
        media,
      },
    });
  },
);

export const deleteMedia = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) return next(new AppError("can't find id:", 404));
    const feature = new ApiCRUD(req.body, Media, id);
    await feature.delete();
    res.status(200).json({
      status: "success",
      data: null,
    });
  },
);
