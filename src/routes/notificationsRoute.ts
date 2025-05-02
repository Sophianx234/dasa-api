import { Router } from "express";
import { getAllNotifications } from "../controllers/notificationsController";


const router = Router()
router.route('/').get(getAllNotifications)

export default router