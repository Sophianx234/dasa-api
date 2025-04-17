import { model, Schema } from "mongoose";

interface eventsI {
  eventImage:string,
  title:string,
  eventDate: Date,
  venue:string

}

const eventsSchema = new Schema<eventsI>({
  eventImage: {
    type: String
  },
  title: String,
  eventDate: Date,
  venue:String
},{
  timestamps:true
})

const Event = model<eventsI>('Event',eventsSchema)

export default Event