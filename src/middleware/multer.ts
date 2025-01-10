import multer, { FileFilterCallback } from "multer";
import path, { dirname } from "path";
import { RequestExtended } from "../controllers/authController";
import { AppError } from "../utils/AppError";


;

const uploadsDir = path.resolve(__dirname, "../uploads");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req: RequestExtended, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        `user-${req.user?.id}-${uniqueSuffix}.${file.originalname.split(".")[1]}`,
      );
    },
  });
  
  const multerFilter = function (
    req: RequestExtended,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) {
    if (file?.mimetype.startsWith("image") || file.mimetype.startsWith('video')) {
      
      cb(null, true);
    } else {
      cb(new AppError("can't upload file. please upload only images", 400));
    }
  };
  
  export const upload = multer({
    storage,
    fileFilter: multerFilter,
  });
  