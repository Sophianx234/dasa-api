import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Server, Socket } from "socket.io";
import Message from "./models/messagesModel";
import Channel from "./models/channelModel";
import { ObjectId } from "mongodb";
import User from "./models/userModel";

interface messageI {
  //   sender: string;
  //   recipient: string;
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
    console.log("Boruto Uzumaki");
    // io.emit('anonymous',"Hello Bro")

    const { content, userId } = message;
    // channelId:  ,
    console.log(message);
    const user = await  User.findById(userId)

    const newMessage = await Message.create({
      sender: userId,
      recipient: undefined,
      content,
      anonymousName: user?.anonymousName,
      messageType: "text",
    });

    console.log("newMessage: ", newMessage);
    /* 
{
    name: {
      type: String,
      required: true,
    },

    members: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    
    messages: [
      {
        type: SchemaTypes.ObjectId,
        ref: "Message",
      },
    ],
  }, */

    if (newMessage.sender && !newMessage.recipient) {
      const anonymousChannel = await Channel.findOneAndUpdate(
        {
          name: "anonymous",
        },
        {
          $push: { messages: newMessage._id },
        },
      );

      // console.log('any',newMessage)
      io.to("anonymous").emit("recieveAnonymous", newMessage);
    }
    /*await Channel.findByIdAndUpdate(channelId,{
            $push:{messages: newMessage._id}
        }) */
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
    socket.on("disconnect", () => disconnect(socket));
  });
}

export default setUpSocket;
