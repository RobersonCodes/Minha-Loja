const ProductService = require("../services/ProductService");

class ProductController {
  async getAll(req, res, next) {
    try {
      const result = await ProductService.getAllProducts(req.query);

      return res.status(200).json({
        success: true,
        message: "Produtos listados com sucesso.",
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await ProductService.getProductById(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Produto encontrado com sucesso.",
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await ProductService.createProduct(req.body);

      return res.status(201).json({
        success: true,
        message: "Produto cadastrado com sucesso.",
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const product = await ProductService.updateProduct(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: "Produto atualizado com sucesso.",
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await ProductService.deleteProduct(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Produto removido com sucesso."
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();