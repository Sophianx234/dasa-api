import fs from "fs";
import { RequestExtended } from "../controllers/authController";
import { multerFile } from "../controllers/mediaController";
import cloudinary from "../middleware/cloudinary";
export const uploadImages = async function (req: RequestExtended, folder:string) {
  if (req.files) {
    const images: multerFile[] = req.files as multerFile[];
    const results = images.map(async (image) => {
      const format = image?.mimetype.split("/")[0] as "video" | "image" | "raw";
      const uploads = await cloudinary.uploader.upload(image.path, {
        use_filename: true,
        unique_filename: true,
        folder: format==='image'?`${folder}/images`:format==='video'?`${folder}/videos`:`${folder}/raw`,
        resource_type: format,
      });

      fs.unlinkSync(image.path);
      return uploads;
    });
    return await Promise.all(results);
  }
};
