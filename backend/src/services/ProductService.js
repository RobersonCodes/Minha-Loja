const ProductRepository = require("../repositories/ProductRepository");
const AppError = require("../utils/app-error");

class ProductService {

  normalizeProductData(data) {

    const name = String(data.name || "").trim();

    const category = String(data.category || "decoracao").trim();

    const image = String(
      data.image || "https://via.placeholder.com/250x180?text=Produto"
    ).trim();

    const description = String(
      data.description ||
      "Produto disponível na loja com ótima apresentação e visual premium."
    ).trim();

    const price = Number(data.price);

    const old_price =
      data.old_price !== undefined &&
      data.old_price !== null &&
      data.old_price !== ""
        ? Number(data.old_price)
        : null;

    const stock =
      data.stock !== undefined &&
      data.stock !== null &&
      data.stock !== ""
        ? Number(data.stock)
        : 10;

    const rating =
      data.rating !== undefined &&
      data.rating !== null &&
      data.rating !== ""
        ? Number(data.rating)
        : 4.5;

    const reviews_count =
      data.reviews_count !== undefined &&
      data.reviews_count !== null &&
      data.reviews_count !== ""
        ? Number(data.reviews_count)
        : 0;

    const featured =
      data.featured === true ||
      data.featured === 1 ||
      data.featured === "1" ||
      data.featured === "true"
        ? 1
        : 0;

    const badge = String(data.badge || "").trim();

    /* NOVOS CAMPOS AFILIADO */

    const affiliate_url = String(data.affiliate_url || "").trim();

    const is_affiliate =
      data.is_affiliate === true ||
      data.is_affiliate === 1 ||
      data.is_affiliate === "1" ||
      data.is_affiliate === "true"
        ? 1
        : 0;

    /* VALIDAÇÕES */

    if (!name) {

      throw new AppError(
        "O nome do produto é obrigatório.",
        400
      );

    }

    if (Number.isNaN(price) || price <= 0) {

      throw new AppError(
        "Informe um preço válido maior que zero.",
        400
      );

    }

    if (
      old_price !== null &&
      (Number.isNaN(old_price) || old_price <= 0)
    ) {

      throw new AppError(
        "Informe um preço antigo válido.",
        400
      );

    }

    if (Number.isNaN(stock) || stock < 0) {

      throw new AppError(
        "Informe um estoque válido.",
        400
      );

    }

    if (
      Number.isNaN(rating) ||
      rating < 0 ||
      rating > 5
    ) {

      throw new AppError(
        "A avaliação deve estar entre 0 e 5.",
        400
      );

    }

    if (
      Number.isNaN(reviews_count) ||
      reviews_count < 0
    ) {

      throw new AppError(
        "A quantidade de avaliações deve ser válida.",
        400
      );

    }

    /* REGRA AFILIADO */

    if (is_affiliate && !affiliate_url) {

      throw new AppError(
        "Produto afiliado precisa ter affiliate_url.",
        400
      );

    }

    return {

      name,
      price,
      old_price,

      category,
      image,
      description,

      stock,

      rating,
      reviews_count,

      featured,
      badge,

      affiliate_url,
      is_affiliate

    };

  }

  async getAllProducts(query) {

    const page = Math.max(Number(query.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(query.limit) || 12, 1),
      100
    );

    const filters = {

      page,
      limit,

      category: query.category || null,

      search: query.search
        ? String(query.search).trim()
        : "",

      sort: query.sort || "newest"

    };

    const result = await ProductRepository.findAll(filters);

    return {

      page: result.pagination.page,

      limit: result.pagination.limit,

      total: result.pagination.total,

      totalPages: result.pagination.totalPages,

      hasNextPage: result.pagination.hasNextPage,

      hasPrevPage: result.pagination.hasPrevPage,

      data: result.items

    };

  }

  async getProductById(id) {

    const productId = Number(id);

    if (Number.isNaN(productId) || productId <= 0) {

      throw new AppError(
        "ID do produto inválido.",
        400
      );

    }

    const product = await ProductRepository.findById(productId);

    if (!product) {

      throw new AppError(
        "Produto não encontrado.",
        404
      );

    }

    return product;

  }

  async createProduct(data) {

    const product = this.normalizeProductData(data);

    return ProductRepository.create(product);

  }

  async updateProduct(id, data) {

    const productId = Number(id);

    if (Number.isNaN(productId) || productId <= 0) {

      throw new AppError(
        "ID do produto inválido.",
        400
      );

    }

    const existingProduct = await ProductRepository.findById(productId);

    if (!existingProduct) {

      throw new AppError(
        "Produto não encontrado.",
        404
      );

    }

    const normalizedData = this.normalizeProductData({

      ...existingProduct,
      ...data

    });

    const updated = await ProductRepository.update(

      productId,
      normalizedData

    );

    if (!updated) {

      throw new AppError(
        "Não foi possível atualizar o produto.",
        400
      );

    }

    return ProductRepository.findById(productId);

  }

  async deleteProduct(id) {

    const productId = Number(id);

    if (Number.isNaN(productId) || productId <= 0) {

      throw new AppError(
        "ID do produto inválido.",
        400
      );

    }

    const existingProduct = await ProductRepository.findById(productId);

    if (!existingProduct) {

      throw new AppError(
        "Produto não encontrado.",
        404
      );

    }

    const deleted = await ProductRepository.delete(productId);

    if (!deleted) {

      throw new AppError(
        "Não foi possível remover o produto.",
        400
      );

    }

    return true;

  }

}

module.exports = new ProductService();