import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      required: true,
      ref: "User",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true, // The actual text message
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Message sent timestamp
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent", // Status of the message
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", messagesSchema);

export default Message;
