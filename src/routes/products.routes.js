import { Router } from "express";
import __dirname from "../utils.js";

import {getAllProducts, productById, postProduct, putProduct, delProduct} from '../controller/products.controller.js'

const router = Router();

router.get("/", getAllProducts)

router.get("/:pid", productById);

router.post("/", postProduct);

router.put("/:pid", putProduct)

router.delete("/:pid", delProduct)

export default router;
