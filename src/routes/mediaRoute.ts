import { Router } from "express";
import {
  createMedia,
  deleteMedia,
  getAllMedia,
  getMedia,
  updateMedia,
} from "../controllers/mediaController";

const router = Router();

router.route("/").get(getAllMedia).post(createMedia);
router.route("/:id").get(getMedia).patch(updateMedia).delete(deleteMedia);

export default router;
