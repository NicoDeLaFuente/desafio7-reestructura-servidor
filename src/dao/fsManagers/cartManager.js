import fs from "fs";

export default class CartManager {
  static carts;
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  addCart = async () => {
    const id = this.carts.length + 1;

    const newCart = {
      id: id,
      products: [],
    };

    this.carts.push(newCart);
  };

  getCart = () => {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, "utf-8");
      return JSON.parse(data);
    } else {
      return [];
    }
  };

  getCartById = async (id) => {
    return this.carts.find((c) => c.id == id);
  };

  addProductToCart = async (cid, pid) => {
    const carrito = this.carts.find((c) => c.id == cid);
    //const product = PRODUCTS_DAO.getProductById(pid)
    if (carrito) {
      const index = carrito.findIndex((p) => p.id == pid);
      if (index !== -1) {
        carrito[index].quantity++;
      } else {
        const newProduct = {
          product: pid,
          quantity: 1,
        };
        carrito.products.push(newProduct);
      }
      return "Success";
    } else {
      return "Cart not found";
    }
  };

  updateCart = async (cid, cart) => {
    const cartToUpdateIndex = this.carts.findIndex((carro) => carro.id === cid);

    carts.splice(cartToUpdateIndex, 1, cart);
    const dataToJson = JSON.stringify(carts);
    return "success";
  };

  deleteProductFromCart = async (cid, pid) => {
    const carrito = this.carritos.find((c) => c.id == cid);
    if (carrito) {
      const indexProduct = carrito.products.findIndex((p) => p.id == pid);
      if (indexProduct === -1) return "Product not found";
      carrito.products.splice(indexProduct, 1);
      return "Success";
    } else {
      return "Cart not found";
    }
  };

  updateProductsToCart = async (cid, products) => {
    const carrito = this.carritos.find((c) => c.id == cid);
    if (carrito) {
      carrito.products = products
      return "sucess"
    }
    else{
      return "Carrito no encontrado."
    }
  }

  updateQuantityOfProduct = async (cid, pid, quantity) => {
    const carrito = this.carritos.find((c) => c.id == cid);
    if (carrito) {
      const productoEnCarrito = carrito.products.findIndex((p) => p.id == pid);
      if (productoEnCarrito !== -1) {
        const product = carrito.products[productoEnCarrito];
        product.quantity = quantity;
        return "Success";
      } else {
        return "Product not found";
      }
    } else {
      return "Cart not found";
    }
  };

  deleteProductsFromCart = async (cid) => {
    const cart = await getCartById(cid);
    cart.products = [];
    const dataToJson = JSON.stringify(cart);
    fs.promises.writeFile(this.path, dataToJson);
    return cart;
  };
}
