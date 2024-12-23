import { Router } from "express";
import { getAllUsers } from "../controllers/userController";
import { signup } from "../controllers/authController";

const router = Router();

router.route('/signup').post(signup)
router.route("/").get(getAllUsers);

export default router;
