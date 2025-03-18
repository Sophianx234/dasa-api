import { Router } from "express";
import { protect } from "../controllers/authController";
import { getAllAnonymous, getAllMessages, getDirectMessage, getMessages, handlefileUpload } from "../controllers/messagesController";
import { upload } from "../middleware/multer";

const router = Router()
router.use(protect)


router.route('/').get(getAllMessages)
router.route('/anonymous').get(getAllAnonymous)
router.route('/:recipientId').get(getDirectMessage)
router.route('/anonymous/upload').post(upload.single('img'),handlefileUpload)


export default router