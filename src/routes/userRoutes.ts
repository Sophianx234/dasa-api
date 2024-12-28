import { Router } from "express";
import { deleteUser, getAllUsers, resizeUserPhoto, updateUser, uploadUserPhoto } from "../controllers/userController";
import {  login, protect, forgotPassword, restrictTo, signup, updatePassword, resetPassword, logout } from "../controllers/authController";

const router = Router();

router.route('/signup').post(signup)
router.route('/logout').post(logout)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').patch(resetPassword)

router.use(protect)
router.route("/").get(restrictTo("admin"),getAllUsers);
router.route("/delete-user").delete(deleteUser);
router.route("/update-user").patch(uploadUserPhoto,resizeUserPhoto,updateUser);
router.route("/update-password").patch(updatePassword)

export default router;
