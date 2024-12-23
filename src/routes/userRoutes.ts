import { Router } from "express";
import { getAllUsers } from "../controllers/userController";

const router = Router();

router.route("/").get(getAllUsers);

export default router;
