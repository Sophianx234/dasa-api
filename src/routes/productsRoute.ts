import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct, uploadProducts, uploadProductsToCloud } from "../controllers/productsController";
import { protect } from "../controllers/authController";
import { uploadMediaToCloud } from "../controllers/mediaController";

const router = Router()
router.use(protect)
router.route('/').get(getAllProducts).post(createProduct)
router.route('/:id').get(getProduct).delete(deleteProduct).patch(uploadProducts,uploadProductsToCloud,updateProduct)

export default router