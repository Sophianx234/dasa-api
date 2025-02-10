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
    const { senderId, recipientId } = req.params;
    if (!senderId && !recipientId)
      return next(new AppError("both sender and recipient Id required", 404));
    const messages = await Message.find({
      sender: senderId,
      recipient: recipientId,
    });
    if (!messages)
      return next(
        new AppError("could not find messages related to users", 400),
      );
    res.status(200).json({
      status: "success",
      messages,
    });
  },
);

export const getAllAnonymous = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const feature = new ApiFeatures(
      req.query,
      Channel.findOne({ name: "anonymous" }).populate({
        path: "messages",
        select: "content anonymousName sender createdAt",
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
