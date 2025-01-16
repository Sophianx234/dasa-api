import mongoose, { Schema, SchemaTypes, model } from "mongoose";

type AnonymousDocument = Document & {
    name: string,
    members: mongoose.Types.ObjectId[]
    messages:mongoose.Types.ObjectId[] 
} 

const AnonymousSchema = new Schema<AnonymousDocument>(
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


const channel = model<AnonymousDocument>("Channel",AnonymousSchema)