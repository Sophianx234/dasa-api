import { Router } from "express";
import { getAllUsers } from "../controllers/userController";
import {  login, protect, forgotPassword, restrictTo, signup, updatePassword, resetPassword } from "../controllers/authController";

const router = Router();

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').patch(resetPassword)

router.use(protect)
router.route("/").get(restrictTo("admin"),getAllUsers);
router.route("/update-password").patch(updatePassword)

export default router;
