import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import { Server,Socket } from "socket.io";
import Message from "./models/messagesModel";
import Channel from "./models/AnonymousModel";

interface messageI {
    sender:string
    ,
    recipient: string,
    content: string,
    channelId: string,
    messageType: 'File'|'Text',
    fileURL: string
}

function setUpSocket(server:HttpServer| HttpsServer){
    const io = new Server(server,{
        cors:{
            credentials: true,
            origin: ['http://localhost:5173','https://dasaug.netlify.app'],
            methods: ["GET","POST"]
        }

    })
    const userSocketMap = new Map()
    console.log(userSocketMap)
    function disconnect(socket:Socket){
        console.log(`Client ${socket.id}disconnected `)
        for(const [userId,socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId)
                break
            }
        }
    }

    const sendAnonymous = async(message:messageI)=>{
        const {sender,recipient,content,channelId,messageType,fileURL} = message
        const newMessage = await Message.create({
            sender,
            recipient: null,
            content,
            channelId,
            messageType,
            fileURL

        })

        await Channel.findByIdAndUpdate(channelId,{
            $push:{messages: newMessage._id}
        })
    }

    io.on('connect',(socket)=>{
        const {userId} = socket.handshake.query
        if(userId){
            userSocketMap.set(userId,socket.id)
            console.log(`User ${userId} connected with ${socket.id}`)
        }else{
            console.log("UserId wasn't provided during handshake")
        }

        socket.on('disconnect',()=>disconnect(socket))
    })
}

export default setUpSocket