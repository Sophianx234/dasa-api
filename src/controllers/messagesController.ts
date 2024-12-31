import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Message from "../models/messagesModel";
import { ApiFeatures } from "../utils/ApiFeatures";
import { AppError } from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";

export const sendMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    console.log(content);
    const { senderId: sender, recipientId: recipient } = req.params;
    if (
      !mongoose.Types.ObjectId.isValid(sender) ||
      !mongoose.Types.ObjectId.isValid(recipient)
    )
      return next(new AppError("Invalid sender or recipient id:", 404));

    const newMessage = await Message.create({ sender, recipient, content });


    res.status(201).json({
      status: "message sent successfully",
      data: {
        newMessage
      }
    });
  },
);

export const getAllMessages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const feature = new ApiFeatures(req.query, Message.find())
      .filter()
      .limit()
      .sort()
      .pagination();
    const messages = await feature.query;
    if (!messages.length) return next(new AppError("can't find messages", 404));
    res.status(200).json({
      numMessages: messages.length,
      status: "success",
      data: {
        messages,
      },
    });
  },
);
