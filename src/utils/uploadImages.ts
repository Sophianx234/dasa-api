import { NextFunction } from "express";
import { RequestExtended } from "../controllers/authController";
import { multerFile } from "../controllers/mediaController";
import cloudinary from "../middleware/cloudinary";
import fs from "fs";
export const uploadImages = async function (
  req: RequestExtended,
  
) {
  if (req.files) {
    const images: multerFile[] = req.files as multerFile[];

    const result = images.map((image) => {
      cloudinary.uploader.upload(image.path, {
        overwrite: true,
        use_filename: true,
        unique_filename: true,
        folder: "Dasa/media",
      });
      fs.unlinkSync(image.path);
    });
    return await Promise.all(result);
  }
};
