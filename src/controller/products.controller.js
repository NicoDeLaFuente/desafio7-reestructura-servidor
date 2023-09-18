import {PRODUCTMANAGER} from "../dao/index.js";

export const getAllProducts = async (req, res) => {
  try {
    const response = await PRODUCTMANAGER.getProductsWithFilters(req)
    res.json({ response });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", err });
  }
};

export const productById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await PRODUCTMANAGER.getProductsById(pid);
    res.json({ message: "success", data: product });
  } catch (err) {
    res.json({
      message: "El ID buscado no se encontro en la BBDD",
      error: err,
    });
  }
};

export const postProduct = async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  const newProduct = {};

  if ((!title, !description, !code, !price, !stock, !category)) {
    res
      .status(400)
      .json({
        status: "Error",
        message: "Faltan datos para poder postear el producto",
      });
  } else {
    (newProduct.title = title),
      (newProduct.description = description),
      (newProduct.code = code),
      (newProduct.price = price),
      (newProduct.status =
        !status || typeof status !== "boolean" ? true : status),
      (newProduct.stock = stock),
      (newProduct.category = category),
      (newProduct.thumbnails = !thumbnails ? [] : thumbnails);
  }

  try {
    const response = await PRODUCTMANAGER.addProduct(newProduct);
    res.json({ message: "producto agregado", product: response });
  } catch (err) {
    res.status(500).json({ message: "problemas con el servidor." });
  }
};

export const putProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = req.body;

    if (
      !title ||
      !description ||
      !code ||
      !price ||
      !status ||
      !stock ||
      !category ||
      !thumbnails
    ) {
      res
        .status(400)
        .json({
          status: "error",
          message: "Faltan datos para actualizar el producto",
        });
    }

    const newProduct = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    const response = await PRODUCTMANAGER.updateProduct(pid, newProduct);
    res.json({ message: "success. Producto actualizado", data: response });
  } catch (err) {
    console.log(err);
    res.json({ message: "No se pudo actualizar el producto", error: err });
  }
};

export const delProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    const response = await PRODUCTMANAGER.deleteProduct(pid);
    res.json({
      message: "success. El producto se ha elimiado",
      data: response,
    });
  } catch (err) {
    res.status(500).json({ message: "no se pudo borrar el producto" });
  }
};
