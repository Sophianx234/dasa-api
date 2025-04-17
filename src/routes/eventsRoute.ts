import { Router } from "express";
import { getAllEvents, removeEvent, updateEvent } from "../controllers/eventsController";

const router = Router()

router.route('/').get(getAllEvents)
router.route('/:id').patch(updateEvent).delete(removeEvent)



export default router