import { Router } from "express";
import { getAllUsers } from "../controllers/userController";
import { isLoggedIn, signup } from "../controllers/authController";

const router = Router();

router.route('/signup').post(signup)
router.route("/").get(isLoggedIn,getAllUsers);

export default router;
