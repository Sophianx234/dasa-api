import { Router } from "express";
import { protect } from "../controllers/authController";
import { getAllAnonymous, getAllMessages, getMessages } from "../controllers/messagesController";

const router = Router()
router.use(protect)
router.route('/').get(getAllMessages)
router.route('/:senderId/:recipientId').get(getMessages)
router.route('/anonymous').get(getAllAnonymous)
router.route('/message').get(getAllAnonymous)


export default router