import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: true, // The URL where the media file is stored
      },
      fileType: {
        type: String,
        required: true, // For example, 'image', 'video', etc.
        enum: ['image', 'video', 'audio', 'document'], // Can be extended as needed
      },
      fileSize: {
        type: Number,
        required: true, // Size of the file in bytes
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // Reference to the User who uploaded the file
        ref: 'User',
      },
      uploadedAt: {
        type: Date,
        default: Date.now, // Timestamp of when the file was uploaded
      },
    },
    { timestamps: true }

)

export const Media = mongoose.model('Media',mediaSchema)