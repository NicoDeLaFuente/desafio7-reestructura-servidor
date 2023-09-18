import fs from "fs";

export default class ProductManager {
  constructor() {
    this.products = [];
  }

  //metodos addProduct, getProductById, modifyProduct, deleteProduct

  async addProduct(product) {
    const id = this.products.length + 1;
    product.id = id;
    this.products.push(product);
    return "success";
  }

  async getProducts() {
    return this.products;
  }

  async getProductsWithFilters () {
    return this.products;
  }

  async getProductsById(id) {
    return this.products.find((p) => p.id == id);
  }

  async updateProduct(id, product) {
    let indexProduct = this.products.findIndex((p) => p.id == id);
    if (indexProduct == -1) return "Product not found";
    this.products[indexProduct] = product;
    return "Success";
  }

  async deleteProduct(id) {
    let product = this.products.find((p) => p.id == id);
    if (product) {
      let indexProduct = this.products.indexOf(product);
      this.products.splice(indexProduct, 1);
      this.products.forEach((p) => {
        p.id = this.products.indexOf(p) + 1;
      });
      return "Success";
    } else {
      return "Product not found";
    }
  }
}

const newProduct = {
  title: "Ejemplo1",
  description: "ejemplo1 description",
  price: 200,
  thumbnail: "sin imagen",
  code: "abc123",
  stock: 20,
};

const newProduct2 = {
  title: "Ejemplo2",
  description: "ejemplo2 description",
  price: 500,
  thumbnail: "sin imagen",
  code: "abc1234",
  stock: 1,
};

const newProduct3 = {
  title: "Ejemplo3",
  description: "ejemplo3 description",
  price: 500,
  thumbnail: "sin imagen",
  code: "acas342",
  stock: 10,
};

const productManager = new ProductManager("./products.json");
/* productManager.addProduct(newProduct);
productManager.addProduct(newProduct2); */
/* productManager.addProduct(newProduct3); */

/* productManager.getProducts(); */
/* productManager.getProductById(1); */
/* productManager.updateProduct(1, {"title": "producto1Actualizado", "stock": 200}) */
/* productManager.deleteProduct(1)*/
