import { Router } from "express";

import { getAllCarts, 
  cartById, 
  postCart, 
  postProductToCart, 
  deleteProductInCart, 
  putProductsInCart,
  updateQuantityOfProductInCart,
  deleteAllProductsFromCart } from "../controller/carts.controller.js";

const router = Router();

router.get("/", getAllCarts);

router.get("/:cid", cartById);

router.post("/", postCart);

router.post("/:cid/product/:pid", postProductToCart);

/* deleteo un producto del carrito seleccionado */
router.delete("/:cid/products/:pid", deleteProductInCart);


//Actualizar el carrito con un arreglo de productos especificado
router.put("/:cid", putProductsInCart);

//Actualizar cantidad de ejemplares del producto seleccionado, del carrito especificado
router.put("/:cid/products/:pid", updateQuantityOfProductInCart);

//Eliminar todos los productos del carrito
router.delete("/:cid", deleteAllProductsFromCart);

export default router;
