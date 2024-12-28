import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../controllers/productsController";

const router = Router()

router.route('/').get(getAllProducts).post(createProduct)
router.route('/:id').get(getProduct).delete(deleteProduct).patch(updateProduct)

export default router