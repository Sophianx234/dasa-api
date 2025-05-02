import mongoose, { model, Schema } from "mongoose"

interface announcementI {
  announcer: string 
  announcerProfile: string, 
  portfolio: string,
  date: string,
  messageType: string,
  title: string
  content: string
  reactions: number
  comments: string[] ;
  createdAt?: Date;
  updatedAt?: Date;

}

const announcementSchema = new Schema<announcementI>({
  announcer:{
    type:String,
    required: [true,'announcer is required']
  },
  date: {
    type:String,
    required:true
  },
  portfolio: {
    type:String,
    required:[true,'portfolio is required']
  },
  announcerProfile:{
    type: String,
    required:true
  },
  messageType:{
    type: String,
    enum:['general', 'urgent', 'event'],
    default:'general'
  },
  title:{
    type:String,
    required: [true,'title is required'],
    
  },
  content: {
    type: String,
    required: [true,'must provide content']
  },
  reactions: Number,
  comments:{
    type: [String],
    
    
  }
},{
  timestamps:true
})


const Announcement = model<announcementI>('Announcement',announcementSchema)
export default Announcement