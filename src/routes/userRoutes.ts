
import {  Router } from "express";
import { getAllUsers } from "../controllers/authController";

const router = Router()

router.route('/').get(getAllUsers)

export default router