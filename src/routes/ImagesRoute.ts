import { Router } from "express";
import { getAllImages } from "../controllers/imagesController.js";


const router = Router();

router.route('/').get(getAllImages);


export default router