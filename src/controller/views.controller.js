import productsModel from "../dao/dbManagers/models/products.models.js";
import {PRODUCTMANAGER} from "../dao/index.js";
import {CARTMANAGER} from "../dao/index.js"

export const getAllProductsRoot = async (req, res) => {
    try{
        const products = await PRODUCTMANAGER.getProducts()
        res.render("home", {products})
    }
    catch(err) {
        res.render("home", `Ha ocurrido un error ${err}`)
    }
}

export const getAllProducts = async (req, res) => {
    try{
      const response = await PRODUCTMANAGER.getProductsWithFilters(req)

      const products = response.docs

      const user = req.session.user

      res.render("products", {
        products,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
        nextLink: response.nextLink,
        prevLink: response.prevLink,
        name: req.session.name,
        lastname: req.session.lastname,
        role: req.session.role
    })
    } 
    catch (err) {
    res.status(500).json({ message: "Something went wrong", err });
    }
}

export const gettingCartById = async (req, res) => {
    try {
        const {cid} = req.params
        const cart = await CARTMANAGER.getCartById(cid)
        const modifiedProducts = cart.products.map(item => ({
            title: item.product.title.toUpperCase(),
            quantity: item.quantity,
            id: item.product._id,
            price: item.product.price,
            thumbnails: item.product.thumbnails
          }));
        res.render("carts", {cid: cid, products: modifiedProducts})
    }
    catch (err) {
        res.json({message: "Algo salio mal al traer el carrito requerido", error: err})
        console.log(err)
    }
}

export const getLogin = async (req, res) => {
    res.render("login", {})
}

export const getSignup = async (req, res) => {
    res.render("signup", {})
}

