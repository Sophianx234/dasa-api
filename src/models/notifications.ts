import { model, Schema } from "mongoose";
interface notificationI {
  notificationImg:string
  content:string,
  type:String,
  createdAt?:Date,
  updatedAt?:Date,
}
const notificationsSchema = new Schema<notificationI>({
  notificationImg:{
    type:String,
    default: "https://i.ibb.co/n8hRM6d/dasalogo-removebg.png", 
  },
  content:{
    type:String
  },
  type:String
},{
  timestamps:true
})


const Notification = model<notificationI>('Notifications',notificationsSchema)
export default Notification