import { Router } from "express";
import { getAllMedia, getMedia, updateMedia } from "../controllers/mediaController";


const router = Router();

router.route('/').get(getAllMedia);
router.route('/:id').get(getMedia).patch(updateMedia)


export default router