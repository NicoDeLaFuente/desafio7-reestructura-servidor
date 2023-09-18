import {CARTMANAGER} from "../dao/index.js";

export const getAllCarts = async (req, res) => {
  try {
    const response = await CARTMANAGER.getCart();
    res.json({ message: "success", data: response });
  } catch (err) {
    res
      .status(500)
      .json({ message: "algo salió mal al traer los carritos :(", error: err });
  }
};

export const cartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await CARTMANAGER.getCartById(cid);
    console.log(response);
    res.json({ message: "success al traer el carrito por ID", data: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "algo salió mal al traer el carrito requerido:(",
      error: err,
    });
  }
};

export const postCart = async (req, res) => {
  try {
    const response = await CARTMANAGER.addCart();
    res.json({ message: "success. Nuevo carrito creado", data: response });
  } catch (err) {
    res
      .status(500)
      .json({ message: "algo salió mal al crear el carrito :(", error: err });
  }
};

export const postProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const response = CARTMANAGER.addProductToCart(cid, pid);
    res.json({
      message: "Success. Producto agregado al carrito correctamente",
      data: response,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Algo salió mal al agregar el producto al carrito" });
  }
};

export const deleteProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const response = CARTMANAGER.deleteProductFromCart(cid, pid);

    if (response !== null) {
      res.json({
        message: "Success. Producto borrado del carrito correctamente",
        data: response,
      });
    } else {
      res.json({
        message:
          "El producto que quiere eliminar no existe en el carrito seleccionado",
      });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Algo salió mal al borrar el producto del carrito." });
  }
};

export const putProductsInCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const [...products] = req.body;
    const result = await CARTMANAGER.updateProductsToCart(cid, products);
    return res.json({ message: "Carrito actualizado", data: result });
  } catch (err) {}
};

export const updateQuantityOfProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const response = await CARTMANAGER.updateQuantityOfProduct(cid, pid, quantity);

    res.json({
      message: "Cantidad de ejemplares actualizada",
      data: response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Algo salió mal :(" });
  }
};

export const deleteAllProductsFromCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await CARTMANAGER.deleteProductsFromCart(cid)
    res.json({ message: "Carrito vaciado", data: response });
  } 
  catch (err) {
    res.status(500).json({message: "Algo salió mal al borrar todos los productos del carrito"})
  }
};
