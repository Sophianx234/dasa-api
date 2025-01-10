import { Router } from "express";
import { forgotPassword, login, logout, protect, resetPassword, restrictTo, signup, updatePassword } from "../controllers/authController";
import { deleteUser, getAllUsers, getUser, resizeUserPhoto, updateUser } from "../controllers/userController";
import { upload } from "../middleware/multer";

const router = Router();

router.route('/signup').post(signup)
router.route('/logout').post(logout)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').patch(resetPassword)

router.use(protect)
router.route("/").get(restrictTo("admin"),getAllUsers);
router.route("/getme").get(getUser);
router.route("/delete-user").delete(deleteUser);
router.route('/upload').patch(upload.single('image'),resizeUserPhoto)
router.route("/update-user").patch(updateUser);
router.route("/update-password").patch(updatePassword)

export default router;
