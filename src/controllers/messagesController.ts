import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Message from "../models/messagesModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { RequestExtended } from "./authController";
import { channel } from "diagnostics_channel";
import Channel from "../models/channelModel";
import { Query } from "mongoose";
import path from "path";
import cloudinary from "../middleware/cloudinary";
import fs from "fs";
export const getAllMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const feature = new ApiFeatures(req.query, Message.find())
      .filter()
      .limit()
      .sort()
      .pagination();
    const messages = await feature.query;
    if (!messages) return next(new AppError("can't find messages", 404));

    Array.isArray(messages) &&
      res.status(200).json({
        numMessages: messages.length,
        status: "success",
        data: {
          messages,
        },
      });
  },
);

export const getMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const senderId = new mongoose.Types.ObjectId(req.params.senderId);
    const recipientId = new mongoose.Types.ObjectId(req.params.recipientId);
    if (!senderId && !recipientId)
      return next(new AppError("both sender and recipient Id required", 404));
    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender recipient", "");

    if (!messages)
      return next(
        new AppError("could not find messages related to users", 400),
      );
    res.status(200).json({
      messages,
    });
  },
);

export const handlefileUpload = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    if (req.file) {
      const image = req.file.path;
      const uploadResult = await cloudinary.uploader
        .upload(image, {
          folder: "Dasa/chat/anonymous",
          public_id: req.user?.id,
          overwrite: true,
          use_filename: true,
          unique_filename: true,
        })
        .catch((error) => {
          console.log(error);
        });
      fs.unlinkSync(image);

      if (!uploadResult)
        return next(new AppError("could not upload file", 404));
      const newMessage = await Message.create({
        sender: req.user?._id,
        recipient: undefined,
        messageType: "file",
        content: req.body.content ,
        fileURL: uploadResult.secure_url,
      });

      const anonymousChannel = await Channel.findOneAndUpdate(
        {
          name: "anonymous",
        },
        {
          $push: { messages: newMessage._id },
        },
      );
      const populatedMessage = await Message.findById(newMessage.id).populate(
        "sender",
        "profileName anonymousName anonymousProfile",
      );
      res.status(200).json({
        populatedMessage,
      });
    }
  },
);

export const handleDMFileUpload = catchAsync(async(req:RequestExtended,res:Response,next:NextFunction)=>{
  if (req.file) {
    const date = Date.now()
    const image = req.file.path;
    const uploadResult = await cloudinary.uploader
      .upload(image, {
        folder: "Dasa/chat/dm",
        public_id: `${req.user?.id}-${date}`,
        overwrite: false,
        use_filename: true,
        unique_filename: true,
      })
      .catch((error) => {
        console.log(error);
      });
    fs.unlinkSync(image);

    if (!uploadResult)
      return next(new AppError("could not upload file", 404));
    const newMessage = await Message.create({
      sender: req.user?._id,
      recipient: req.params.recipientId,
      messageType: "file",
      content: req.body.content ,
      fileURL: uploadResult.secure_url,
    });

    
    const populatedMessage = await Message.findById(newMessage.id).populate([
      {path:"sender",
      select: "profileName profileImage firstName"},
      {path:"recipient",
        select: "profileName profileImage firstName"}]
    );
    res.status(200).json({
      populatedMessage,
    });
  }

})

export const getAllAnonymous = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const feature = new ApiFeatures(
      req.query,
      Channel.findOne({ name: "anonymous" }).populate({
        path: "messages",
        select: "content fileURL anonymousName sender createdAt",
        populate: {
          path: "sender",
          select: "anonymousProfile anonymousName",
        },
      }),
      true,
    )
      .filter()
      .sort()
      .limit();
    const anonymous = await feature.query;
    res.status(200).json({
      status: "success",
      anonymous,
    });
  },
);

export const getDirectMessage = catchAsync(
  async (req: RequestExtended, res: Response, next: NextFunction) => {
    const { recipientId } = req.params;

    console.log(recipientId);
    console.log("sender", req?.user?._id);
    const messages = await Message.find({
      $or: [
        { recipient: recipientId, sender: req?.user?._id },
        { recipient: req?.user?._id, sender: recipientId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate([
        { path: "sender", select: "firstName profileImage" },
        { path: "recipient", select: "firstName profileImage" },
      ]);
    res.status(200).json({
      messages,
    });
  },
);
