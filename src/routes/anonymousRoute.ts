import { Router } from "express";
import { deleteAnonymous, getAllAnonymous, sendAnonymous } from "../controllers/anonymousController";

const router = Router()

router.route("/").get(getAllAnonymous).post(sendAnonymous)
router.route('/:id').delete(deleteAnonymous)

export default router

