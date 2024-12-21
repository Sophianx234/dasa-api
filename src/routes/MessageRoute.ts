import { Router } from "express";
import { getAllMessages, sendMessage } from "../controllers/messagesController";
import { getAllMedia } from "../controllers/mediaController";

const router = Router()

router.route('/').get(getAllMessages)
router.route('/:senderId/:recipientId').post(sendMessage)


export default router