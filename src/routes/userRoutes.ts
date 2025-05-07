import { Router } from "express";
import { forgotPassword, login, logout, protect, resetPassword, restrictTo, signup, updatePassword } from "../controllers/authController";
import { checkUserIsAuthenticated, deleteMe, deleteUser, getAllUsers, getMe, getUser, resizeUserPhoto, updateCurrentUser, updateUser } from "../controllers/userController";
import { upload } from "../middleware/multer";

const router = Router();

router.route('/signup').post(signup)
router.route('/logout').post(logout)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').patch(resetPassword)

router.use(protect)
router.route('/auth/check').get(checkUserIsAuthenticated)
router.route("/getme").get(getMe);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);
router.route("/").get(getAllUsers);
router.route("/deleteMe").delete(deleteMe);
;
router.route('/upload').patch(upload.single('image'),resizeUserPhoto)
// router.route("/update/").patch();
router.route("/updateMe").patch(updateCurrentUser);
router.route("/update-password").patch(updatePassword)

export default router;
