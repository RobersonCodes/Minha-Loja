const db = require("../config/database");

class ProductRepository {
  findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      const conditions = [];
      const params = [];

      if (filters.category && filters.category !== "todos") {
        conditions.push(`
          LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(category,
            'á','a'),'à','a'),'â','a'),'ã','a'),'é','e')) LIKE ?
        `);

        const normalizedCategory = String(filters.category)
          .toLowerCase()
          .trim();

        params.push(`%${normalizedCategory}%`);
      }

      if (filters.search) {
        conditions.push("(name LIKE ? OR description LIKE ?)");
        params.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      let whereClause = "";

      if (conditions.length > 0) {
        whereClause = `WHERE ${conditions.join(" AND ")}`;
      }

      let orderBy = "id DESC";

      switch (filters.sort) {
        case "price_asc":
        case "price-asc":
          orderBy = "price ASC";
          break;

        case "price_desc":
        case "price-desc":
          orderBy = "price DESC";
          break;

        case "name_asc":
        case "name-asc":
          orderBy = "name ASC";
          break;

        case "name_desc":
        case "name-desc":
          orderBy = "name DESC";
          break;

        case "rating_desc":
        case "rating-desc":
          orderBy = "rating DESC";
          break;

        default:
          orderBy = "id DESC";
          break;
      }

      const limit = Number(filters.limit) || 20;
      const page = Number(filters.page) || 1;
      const offset = (page - 1) * limit;

      const countSql = `
        SELECT COUNT(*) as total
        FROM products
        ${whereClause}
      `;

      const dataSql = `
        SELECT
          id,
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
        FROM products
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT ? OFFSET ?
      `;

      db.get(countSql, params, (countError, countRow) => {
        if (countError) {
          return reject(countError);
        }

        const total = countRow?.total || 0;
        const totalPages = Math.ceil(total / limit);

        db.all(dataSql, [...params, limit, offset], (dataError, rows) => {
          if (dataError) {
            return reject(dataError);
          }

          resolve({
            items: rows,
            pagination: {
              page,
              limit,
              total,
              totalPages,
              hasNextPage: page < totalPages,
              hasPrevPage: page > 1
            }
          });
        });
      });
    });
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT
            id,
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
          FROM products
          WHERE id = ?
        `,
        [id],
        (error, row) => {
          if (error) return reject(error);
          resolve(row);
        }
      );
    });
  }

  create(product) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO products (
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
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        product.name,
        product.price,
        product.old_price,
        product.category,
        product.image,
        product.description,
        product.stock,
        product.rating,
        product.reviews_count,
        product.featured,
        product.badge,
        product.affiliate_url || "",
        product.is_affiliate || 0
      ];

      db.run(sql, params, function (error) {
        if (error) return reject(error);

        resolve({
          id: this.lastID,
          ...product
        });
      });
    });
  }

  update(id, product) {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE products
        SET
          name = ?,
          price = ?,
          old_price = ?,
          category = ?,
          image = ?,
          description = ?,
          stock = ?,
          rating = ?,
          reviews_count = ?,
          featured = ?,
          badge = ?,
          affiliate_url = ?,
          is_affiliate = ?
        WHERE id = ?
      `;

      const params = [
        product.name,
        product.price,
        product.old_price,
        product.category,
        product.image,
        product.description,
        product.stock,
        product.rating,
        product.reviews_count,
        product.featured,
        product.badge,
        product.affiliate_url || "",
        product.is_affiliate || 0,
        id
      ];

      db.run(sql, params, function (error) {
        if (error) return reject(error);
        resolve(this.changes > 0);
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        "DELETE FROM products WHERE id = ?",
        [id],
        function (error) {
          if (error) return reject(error);
          resolve(this.changes > 0);
        }
      );
    });
  }
}

module.exports = new ProductRepository();