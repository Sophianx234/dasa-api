import mongoose, { Document, Model } from "mongoose";

export type mediaDocument = Document & {
  asset_id: string,
  public_id: string,
  version: number,
  version_id: string,
  signature: string,
  width: number,
  height: number,
  format: string,
  resource_type: string,
  created_at: Date,
  tags: string[],
  bytes: number,
  type: string,
  etag: string,
  placeholder: boolean,
  url: string,
  secure_url: string,
  asset_folder: string,
  display_name: string,
  original_filename:string
  
,
    uploadedAt: Date
}

export type mediaModel = Model<mediaDocument>
const mediaSchema = new mongoose.Schema<mediaDocument>({

    asset_id: String,
    public_id: String,
    version: Number,
    version_id: String,
    signature: String,
    width: Number,
    height: Number,
    format: String,
    resource_type: String,
    created_at: Date,
    tags: Array,
    bytes: Number,
    type: String,
    etag: String,
    placeholder: Boolean,
    url: String,
    secure_url: String,
    asset_folder: String,
    display_name: String,
    original_filename:String
    
  ,
      uploadedAt: {
        type: Date,
        default: Date.now, // Timestamp of when the file was uploaded
      },
    },
    { timestamps: true }

)

export const Media = mongoose.model<mediaModel>('Media',mediaSchema)