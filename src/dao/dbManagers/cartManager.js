import cartsModels from "./models/carts.models.js";

export default class CartManager {
  constructor() {}

  addCart = async () => {
    const newCart = {
      products: [],
    };

    const cartAdded = await cartsModels.create(newCart);
    return cartAdded;
  };

  getCart = async () => {
    const response = await cartsModels.find().populate("products.product");
    return response;
  };

  getCartById = async (id) => {
    const response = await cartsModels
      .findOne({ _id: id })
      .populate("products.product");
    return response;
  };

  addProductToCart = async (cid, pid) => {
    try {
      /* traigo el carrito con el ID buscado */
      const cart = await getCartById(cid);
      /* chequeo si dentro del carrito hay un producto con el pid igual */
      const productIndex = cart.products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      /* condicional parar determinar la accion a tomar dependiendo si existe el producto o no */
      if (productIndex === -1) {
        const newProduct = {
          product: pid,
          quantity: 1,
        };

        cart.products.push(newProduct);
        const response = await cartsModels.findByIdAndUpdate(cid, {
          products: cart.products,
        });
        return response;
      } else {
        /* obtengo la cantidad del producto y lo incremento en 1. */
        let newQuantity = cart.products[productIndex].quantity;
        newQuantity++;

        // Actualizo el campo 'quantity' del producto existente
        cart.products[productIndex].quantity = newQuantity;
        await cartsModels.findByIdAndUpdate(cid, { products: cart.products });
        const response = await cartsModels.findById(cid);
        return response;
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Algo salío mal al agregar el producto al carrito :(",
        error: err,
      });
    }
  };

  updateCart = async (cid, cart) => {
    const response = cartsModels.findByIdAndUpdate(cid, cart);
    return response;
  };

  /* DELETE PRODUCTO FROM CART. */
  deleteProductFromCart = async (cid, pid) => {
    try {
      let carrito = await getCartById(cid);
      console.log(carrito);
      let productos = carrito.products;
      /* busco si el producto que quiero borrar, existe en el carrito */
      let producto = productos.findIndex(
        (producto) => producto.product._id.toString() === pid
      );

      /* si el carrito existe, deleteo. Sino, mensaje de error */
      if (producto !== -1) {
        productos.splice(producto, 1);
        let result = await cartsModels.findByIdAndUpdate(cid, carrito);
        return result;
      } else {
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* Agregar los productos en array en el carrito seleccionado */
  updateProductsToCart = async (cid, products) => {
    try {
      console.log(products);
      /* traigo el carrito */
      const cart = await getCartById(cid);
      cart.products = products;
      cart.save();
      return cart;
    } catch (err) {
      console.log(err);
    }
  };

  /* Actualziar cantidad de producto en carrito */
  updateQuantityOfProduct = async (cid, pid, quantity) => {
    try {
      let carrito = await getCartById(cid);
      let products = carrito.products;
      let productIndex = products.findIndex(
        (product) => product.product._id.toString() === pid
      );
      if (productIndex !== -1) {
        products[productIndex].quantity = quantity;
        let result = await cartsModels.findByIdAndUpdate(cid, carrito);
        return result;
      } else {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /* Eliminar todos los productos del carrito */
  deleteProductsFromCart = async (cid) => {
    try {
      const cart = await getCartById(cid);
      cart.products = [];
      cart.save();
      return cart;
    } catch (err) {
      console.log(err);
    }
  };
}
