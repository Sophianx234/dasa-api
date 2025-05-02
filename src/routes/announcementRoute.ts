import { Router } from "express";
import { createAnnouncement, deleteAnnouncement, getAllAnnouncements, updateAnnouncement } from "../controllers/announcementController";

const router = Router()

router.route('/').get(getAllAnnouncements).post(createAnnouncement)
router.route('/:id').delete(deleteAnnouncement).patch(updateAnnouncement)

export default router