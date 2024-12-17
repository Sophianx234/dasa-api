import { Router } from "express";
import { getAllImages } from "../controllers/imagesController";


const router = Router();

router.route('/').get(getAllImages);


export default router