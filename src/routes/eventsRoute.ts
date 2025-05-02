import { Router } from "express";
import { createEvent, getAllEvents, removeEvent, updateEvent } from "../controllers/eventsController";
import { upload } from "../middleware/multer";

const router = Router()

router.route('/').get(getAllEvents).post(upload.single('eventImg'),createEvent)
router.route('/:id').patch(updateEvent).delete(removeEvent)



export default router