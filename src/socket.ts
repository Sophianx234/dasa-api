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

    

    if (newMessage.sender && !newMessage.recipient) {
      const anonymousChannel = await Channel.findOneAndUpdate(
        {
          name: "anonymous",
        },
        {
          $push: { messages: newMessage._id },
        },
      );
      const populatedMessage = await Message.findById(newMessage.id).populate("sender", 'profileName anonymousName anonymousProfile')

      io.to("anonymous").emit("recieveAnonymous", populatedMessage);


    }
    
  };
  const sendMessage = async(message:messageI)=>{
    const {userId,recipientId,content} = message

    const newMessage = await Message.create({
      sender: userId,
      recipient: recipientId,
      content,
      messageType: 'text'
    })

    console.log('test',newMessage)
    if(newMessage.sender && newMessage.recipient){
      io.to(recipientId).emit('recieveMessage',newMessage)
      io.to(userId).emit('recieveMessage',newMessage)
    }

  }
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
    socket.on("disconnect", () => disconnect(socket));
  });
}

export default setUpSocket;
