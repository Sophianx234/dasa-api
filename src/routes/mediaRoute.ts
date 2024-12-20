import { Router } from "express";
import { getAllMedia } from "../controllers/mediaController";


const router = Router();

router.route('/').get(getAllMedia);


export default router