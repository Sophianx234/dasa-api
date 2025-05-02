import { model, Schema } from "mongoose";

interface eventsI {
  eventImage: string;
  title: string;
  eventDate: Date;
  venue: string;
  time: string;
}

const eventsSchema = new Schema<eventsI>(
  {
    eventImage: {
      type: String,
      require:[true,'must contain event image'],
      default:"https://i.ibb.co/n8hRM6d/dasalogo-removebg.png"
    },
    title:{
      type:String,
      require:[true,'must contain event title']},
    eventDate:{
      type: Date,
      require:[true,'must contain event date']},
    venue: {
      type:String,
      require:[true,'must contain event venue']},
    time: {
      type:String,
      require:[true,'must contain event time']},
  },
  {
    timestamps: true,
  },
);

const Event = model<eventsI>("Event", eventsSchema);

export default Event;
