const adminRepository = require("../repositories/AdminRepository");

class AdminService {
  toNumber(value) {
    const numericValue = Number(value);
    return Number.isNaN(numericValue) ? 0 : numericValue;
  }

  normalizeStatus(rows = []) {
    const base = {
      pending: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      canceled: 0,
    };

    rows.forEach((row) => {
      const status = row?.status;
      const total = this.toNumber(row?.total);

      if (!status) return;

      base[status] = total;
    });

    return base;
  }

  async getDashboardMetrics() {
    const [
      summary,
      ordersByStatusRows,
      salesByDay,
      topProducts,
      salesByCategory,
      recentOrders,
    ] = await Promise.all([
      adminRepository.getSummary(),
      adminRepository.getOrdersByStatus(),
      adminRepository.getSalesByDay(7),
      adminRepository.getTopProducts(5),
      adminRepository.getSalesByCategory(),
      adminRepository.getRecentOrders(8),
    ]);

    return {
      summary: {
        totalRevenue: this.toNumber(summary?.totalRevenue),
        totalOrders: this.toNumber(summary?.totalOrders),
        averageTicket: this.toNumber(summary?.averageTicket),
        totalCustomers: this.toNumber(summary?.totalCustomers),
        canceledOrders: this.toNumber(summary?.canceledOrders),
      },

      ordersByStatus: this.normalizeStatus(ordersByStatusRows),

      salesByDay: (salesByDay || []).map((item) => ({
        date: item?.date || null,
        revenue: this.toNumber(item?.revenue),
        orders: this.toNumber(item?.orders),
      })),

      topProducts: (topProducts || []).map((item) => ({
        productId: this.toNumber(item?.productId),
        name: item?.name || "Produto sem nome",
        category: item?.category || "Sem categoria",
        quantitySold: this.toNumber(item?.quantitySold),
        revenue: this.toNumber(item?.revenue),
      })),

      salesByCategory: (salesByCategory || []).map((item) => ({
        category: item?.category || "Sem categoria",
        revenue: this.toNumber(item?.revenue),
        orders: this.toNumber(item?.orders),
      })),

      recentOrders: (recentOrders || []).map((item) => ({
        id: this.toNumber(item?.id),
        customerName: item?.customerName || "-",
        customerEmail: item?.customerEmail || "-",
        total: this.toNumber(item?.total),
        status: item?.status || "pending",
        createdAt: item?.createdAt || null,
      })),
    };
  }
}

module.exports = new AdminService();