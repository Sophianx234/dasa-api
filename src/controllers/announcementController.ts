import { NextFunction, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { RequestExtended } from "./authController";
import Announcement from "../models/announcementModel";
import { AppError } from "../utils/AppError";
import { filteredObj } from "../utils/filteredObj";

export const getAllAnnouncements = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const announcements = await Announcement.find().sort({createdAt:-1});
    if (!announcements)
      return next(new AppError("could not find announcements", 400));
    res.status(200).json({
      announcements,
    });
  },
);
export const createAnnouncement = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    try{

      console.log('broxx',req.body)
      const announcement = await Announcement.create(req.body);
      if (!announcement)
        return next(new AppError("could not create announcement", 400));
      res.status(200).json({
        announcement,
      });
    }catch(err){
      console.log(err)
    }
  },
);
export const updateAnnouncement = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
    );
    if (!announcement)
      return next(new AppError("could not create announcement", 400));
    res.status(200).json({
      announcement,
    });
  },
);

export const deleteAnnouncement = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement)
      return next(
        new AppError("could not find announcement with specified ID:", 400),
      );
    res.status(200).json({
      status: "success",
      data: null,
    });
  },
);
