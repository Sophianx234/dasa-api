import { NextFunction } from "express";
import mongoose, { CallbackError, mongo } from "mongoose";

export type messagesDocument = Document & {
  sender: mongoose.Types.ObjectId,
  recipient: mongoose.Types.ObjectId,
  messageType: 'file'| 'text',
  anonymousName: string
  content: string,
  fileURL: string,
  
}
const messagesSchema = new mongoose.Schema<messagesDocument>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: "User",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      
      ref: "User",
    },
    anonymousName:String,
    messageType: {
      type: String,
      enum: ["text", "file"],
      required: true,
    },
    
    content: {
      type: String,
      required: function (this: messagesDocument) {
        return this.messageType === "text";
      },
    },
    fileURL: {
      type: String,
      required: function (this: messagesDocument) {
        return this.messageType === "file";
      },
    }
  }
    ,
  { timestamps: true }
);


 


const Message = mongoose.model<messagesDocument>("Message", messagesSchema);

export default Message;
