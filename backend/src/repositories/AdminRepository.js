const db = require("../config/database");

class AdminRepository {
  queryOne(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (error, row) => {
        if (error) return reject(error);
        resolve(row || null);
      });
    });
  }

  queryAll(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (error, rows) => {
        if (error) return reject(error);
        resolve(rows || []);
      });
    });
  }

  async getSummary() {
    const sql = `
      SELECT
        ROUND(
          COALESCE(SUM(CASE WHEN status != 'canceled' THEN total ELSE 0 END), 0),
          2
        ) AS totalRevenue,
        COUNT(*) AS totalOrders,
        ROUND(
          COALESCE(AVG(CASE WHEN status != 'canceled' THEN total END), 0),
          2
        ) AS averageTicket,
        COUNT(DISTINCT customer_email) AS totalCustomers,
        SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) AS canceledOrders
      FROM orders
    `;

    return this.queryOne(sql);
  }

  async getOrdersByStatus() {
    const sql = `
      SELECT
        status,
        COUNT(*) AS total
      FROM orders
      GROUP BY status
      ORDER BY total DESC
    `;

    return this.queryAll(sql);
  }

  async getSalesByDay(limit = 7) {
    const sql = `
      SELECT
        DATE(created_at) AS date,
        ROUND(
          COALESCE(SUM(CASE WHEN status != 'canceled' THEN total ELSE 0 END), 0),
          2
        ) AS revenue,
        COUNT(*) AS orders
      FROM orders
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) DESC
      LIMIT ?
    `;

    const rows = await this.queryAll(sql, [limit]);
    return rows.reverse();
  }

  async getTopProducts(limit = 5) {
    const sql = `
      SELECT
        oi.product_id AS productId,
        oi.product_name AS name,
        COALESCE(oi.product_category, 'Sem categoria') AS category,
        SUM(oi.quantity) AS quantitySold,
        ROUND(COALESCE(SUM(oi.line_total), 0), 2) AS revenue
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      WHERE o.status != 'canceled'
      GROUP BY oi.product_id, oi.product_name, oi.product_category
      ORDER BY quantitySold DESC, revenue DESC
      LIMIT ?
    `;

    return this.queryAll(sql, [limit]);
  }

  async getSalesByCategory() {
    const sql = `
      SELECT
        COALESCE(oi.product_category, 'Sem categoria') AS category,
        ROUND(COALESCE(SUM(oi.line_total), 0), 2) AS revenue,
        COUNT(DISTINCT oi.order_id) AS orders
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      WHERE o.status != 'canceled'
      GROUP BY oi.product_category
      ORDER BY revenue DESC
    `;

    return this.queryAll(sql);
  }

  async getRecentOrders(limit = 8) {
    const sql = `
      SELECT
        id,
        customer_name AS customerName,
        customer_email AS customerEmail,
        total,
        status,
        created_at AS createdAt
      FROM orders
      ORDER BY datetime(created_at) DESC
      LIMIT ?
    `;

    return this.queryAll(sql, [limit]);
  }
}

module.exports = new AdminRepository();