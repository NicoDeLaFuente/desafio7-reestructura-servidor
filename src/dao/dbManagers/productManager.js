import productsModel from "./models/products.models.js";

export default class ProductManager {
  constructor() {

  }

  getProducts = async () => {
    const response = await productsModel.find().lean();
    return response;
  };

  getProductsWithFilters = async (req) => {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      // Validar y formatear los parámetros
      const parsedLimit = parseInt(limit);
      const parsedPage = parseInt(page);
      const parsedSort = sort === "asc" ? 1 : -1; // Ejemplo para manejar orden ascendente/descendente
  
      const filter = query ? { category: query } : {};
  
      const results = await productsModel.paginate(filter, {
        limit: parsedLimit,
        page: parsedPage,
        lean: true,
        sort: { price: parsedSort },
      });
  
      // Generar enlaces previos y siguientes
      const prevParams = new URLSearchParams({
        limit,
        page: parsedPage - 1,
        query,
        sort,
      });
      const nextParams = new URLSearchParams({
        limit,
        page: parsedPage + 1,
        query,
        sort,
      });
  
      results.prevLink = results.hasPrevPage
        ? `http://localhost:8080/productos/?${prevParams}`
        : null;
  
      results.nextLink = results.hasNextPage
        ? `http://localhost:8080/productos/?${nextParams}`
        : null;
  
      return results
    } catch (err) {
      res.status(500).json({ message: "Something went wrong", err });
    }
  }

  getProductsById = async (id) => {
    try {
      const response = await productsModel.findById(id);
      if (response) {
        return response;
      } else {
        return "Producto no encontrado";
      }
    } catch (err) {
      console.log(err);
    }
  };

  addProduct = async (product) => {
    try {
      await productsModel.create(product);
      return product;
    } catch (err) {
      console.log(err);
    }
  };

  updateProduct = async (id, product) => {
    try {
      await productsModel.findByIdAndUpdate(id, product);
      return product;
    } catch (err) {
      console.log(err);
    }
  };

  deleteProduct = async (id) => {
    try {
      const response = await productsModel.findByIdAndDelete(id);
      return response;
    } catch (err) {
      console.log(err);
    }
  };

}
