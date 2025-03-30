import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Server, Socket } from "socket.io";
import Message from "./models/messagesModel";
import Channel from "./models/channelModel";
import { ObjectId } from "mongodb";
import User from "./models/userModel";
import { catchAsync } from "./utils/catchAsync";
import { NextFunction } from "express";

interface messageI {
  recipientId: string;
  content: string;
  userId: string;
  anonymousName: string;
  //   channelId: string;
  //   messageType: "File" | "Text";
  //   fileURL: string;
}
export type signupCredentials = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contact: string;
  hall?: string;
  course?: string;

  confirmPassword?: string | boolean | null;
};

type signupCredentialsExtended = signupCredentials & {
  username: string;
  profileImage: string;
  _id: string;
  anonymousName: string;
  anonymousProfile: string;
};
type dmType = {
  sender: signupCredentialsExtended;
  recipient: signupCredentialsExtended;
  messageType: "text" | "file";
  content: string;
  _id: string;
  createdAt: string;
  fileURL: string;
};
type userIsTypingI = {
  userInfo: signupCredentialsExtended;
  type: "direct" | "channel";
  recipientId: string;
};

function setUpSocket(server: HttpServer | HttpsServer) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://dasaug.netlify.app"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();
  console.log(userSocketMap);
  function disconnect(socket: Socket) {
    console.log(`Client ${socket.id} disconnected `);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  }

  const sendAnonymous = async (message: messageI) => {
    const { content, userId } = message;

    const newMessage = await Message.create({
      sender: userId,
      recipient: undefined,
      content,
      messageType: "text",
    });
    console.log("xxyy", newMessage);

    if (newMessage.sender && !newMessage.recipient) {
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

      io.to("anonymous").emit("recieveAnonymous", populatedMessage);
    }
  };
  const sendMessage = async (message: messageI) => {
    const { userId, recipientId, content } = message;

    let newMessage = await Message.create({
      sender: userId,
      recipient: recipientId,
      content,
      messageType: "text",
    });
    newMessage = await newMessage.populate([
      {
        path: "sender",
        select: "profileImage firstName",
      },
      {
        path: "recipient",
        select: "profileImage firstName",
      },
    ]);

    const sender = userSocketMap.get(message?.userId);
    const reciever = userSocketMap.get(message.recipientId);

    console.log("test", newMessage);
    console.log("recipient", recipientId);
    if (newMessage.sender && newMessage.recipient) {
      io.to(reciever).emit("recieveMessage", newMessage);
      io.to(sender).emit("recieveMessage", newMessage);
    }
  };
  const handleFile = async (data: dmType) => {
    console.log("naruto", data);
    const sender = userSocketMap.get(data.sender._id);
    if (data.recipient) {
      io.to(sender).emit("recieveFile", data);
      const recipient = userSocketMap.get(data.recipient._id);
      io.to(recipient).emit("recieveFile", data);
    } else {
      io.to("anonymous").emit("recieveFile", data);
    }
  };

  const handleUserIsTyping = (
    message: userIsTypingI,
  ) => {
    console.log("dormamu", message);
    if (message.type === "channel") {
      io.to("anonymous").emit("isTyping", message.userInfo);
    }
    if (message.type === "direct") {
      const recipient = userSocketMap.get(message.recipientId);

      io.to(recipient).emit("isTyping", message.userInfo);
    }
  };
  io.on("connect", (socket) => {
    console.log("user Connected");
    const { userId } = socket.handshake.query;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected with ${socket.id}`);
      socket.join("anonymous");
    } else {
      console.log("UserId wasn't provided during handshake");
    }
    socket.on("anonymous", sendAnonymous);
    socket.on("message", sendMessage);
    socket.on("upload", handleFile);
    socket.on("typing", handleUserIsTyping);
    socket.on("disconnect", () => disconnect(socket));
  });
}

export default setUpSocket;
