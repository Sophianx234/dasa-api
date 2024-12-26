import { Router } from "express";
import { getAllUsers } from "../controllers/userController";
import {  login, protect, forgotPassword, restrictTo, signup, updatePassword } from "../controllers/authController";

const router = Router();

router.route('/signup').post(signup)
router.route('/login').post(forgotPassword,login)

router.use(protect)
router.route("/").get(restrictTo("admin"),getAllUsers);
router.route("/update-password").patch(updatePassword)

export default router;
