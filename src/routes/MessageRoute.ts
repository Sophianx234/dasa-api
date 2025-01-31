import { Router } from "express";
import { protect } from "../controllers/authController";
import { getAllAnonymous, getAllMessages } from "../controllers/messagesController";

const router = Router()
router.use(protect)
router.route('/').get(getAllMessages)
router.route('/anonymous').get(getAllAnonymous)


export default router