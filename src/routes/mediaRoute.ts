import { Router } from "express";
import {
  createMedia,
  deleteMedia,
  getAllMedia,
  getMedia,
  updateMedia,
  uploadMedia,
  uploadMediaToCloud,
} from "../controllers/mediaController";
import { protect } from "../controllers/authController";

const router = Router();
router.use(protect)
router.post('/upload',uploadMedia,uploadMediaToCloud)
router.route("/").get(getAllMedia).post(createMedia);
router.route("/:id").get(getMedia).patch(updateMedia).delete(deleteMedia);

export default router;
