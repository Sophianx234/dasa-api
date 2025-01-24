import mongoose, { Schema, SchemaTypes, model } from "mongoose";

type channelDocument = Document & {
    name: string,
    members: mongoose.Types.ObjectId[]
    messages:mongoose.Types.ObjectId[] 
} 

const channelSchema = new Schema<channelDocument>(
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
    messages: [{
        type: SchemaTypes.ObjectId,
        ref: "Message",
      },]
  },
  {
    timestamps: true,
  }
);


const Channel = model<channelDocument>("Channel",channelSchema)

export default Channel