import { Router } from "express";
import {
  createMedia,
  deleteMedia,
  getAllImages,
  getAllMedia,
  getAllVideos,
  getMedia,
  updateMedia,
  uploadMedia,
  uploadMediaToCloud,
} from "../controllers/mediaController";
import { protect } from "../controllers/authController";

const router = Router();
router.get("/videos",getAllVideos);
router.use(protect)
router.post('/upload',uploadMedia,uploadMediaToCloud)
router.route("/images").get(getAllImages);
router.route("/").get(getAllMedia).post(createMedia);
router.route("/:id").get(getMedia).patch(updateMedia).delete(deleteMedia);

export default router;
