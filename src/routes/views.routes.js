import { Router } from "express";

import {getAllProductsRoot, getAllProducts, gettingCartById, getLogin, getSignup} from '../controller/views.controller.js'

const router = Router()
/* funcion para validar la autenticacion del usuario. */
function auth(req, res, next) {
  if (req.session?.email && (req.session.admin || req.session.role === "user")) {
    return next();
  }
  return res.status(401).render("authError", {});
}

router.get("/", getAllProductsRoot)

router.get("/products", auth, getAllProducts)

router.get("/cart/:cid", gettingCartById)

router.get("/login", getLogin)

router.get("/signup", getSignup)

export default router