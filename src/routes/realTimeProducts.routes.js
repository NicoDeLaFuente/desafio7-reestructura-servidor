import { Router } from "express";
import ProductManager from "../dao/dbManagers/productManager.js";

const router = Router()

router.get("/", async (req, res) => {
    const products = await ProductManager.getProducts()
    res.render("realTimeProducts", {products})
})

export default router;