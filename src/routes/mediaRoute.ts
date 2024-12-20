import { Router } from "express";
import { deleteMedia, getAllMedia, getMedia, updateMedia } from "../controllers/mediaController";


const router = Router();

router.route('/').get(getAllMedia);
router.route('/:id').get(getMedia).patch(updateMedia).delete(deleteMedia)


export default router