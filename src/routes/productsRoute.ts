import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct } from "../controllers/productsController";

const router = Router()

router.route('/').get(getAllProducts).post(createProduct)
router.route('/:id').get(getProduct).delete(deleteProduct)

export default router