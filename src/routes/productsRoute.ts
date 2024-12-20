import { Router } from "express";
import { deleteProduct, getAllProducts, getProduct } from "../controllers/productsController";

const router = Router()

router.route('/').get(getAllProducts)
router.route('/:id').get(getProduct).delete(deleteProduct)

export default router