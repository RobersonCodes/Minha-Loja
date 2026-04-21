const adminService = require("../services/AdminService");

class AdminController {
  async getMetrics(req, res, next) {
    try {
      const data = await adminService.getDashboardMetrics();

      return res.status(200).json({
        success: true,
        message: "Métricas administrativas carregadas com sucesso.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();