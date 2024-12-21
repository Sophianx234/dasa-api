import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { ApiCRUD } from "../utils/ApiCRUD";
import Message from "../models/messagesModel";
import { AppError } from "../utils/AppError";
import User from "../models/userModel";
import { ApiFeatures } from "../utils/ApiFeatures";

export const sendMessage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { senderId, recipientId } = req.params;
    const { content } = req.body;
    if (!senderId || !recipientId)
      return next(new AppError("can't find sender or recipient id", 404));
    const sender = await User.findById(senderId);
    const recipient = await User.findById(senderId);
    if (!sender || !recipient)
      return next(new AppError("can't find sender or recipient", 404));
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    await message.save();

    res.status(201).json({
      status: "message sent successfully",
      data: {
        message,
      },
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
    const messages = await feature.query
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
