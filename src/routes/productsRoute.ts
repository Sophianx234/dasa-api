import { Router } from "express";
import { getAllProducts, getProduct } from "../controllers/productsController";

const router = Router()

router.route('/').get(getAllProducts)
router.route('/:id').get(getProduct)

export default router