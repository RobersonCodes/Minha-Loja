const uploadService = require("../services/UploadService");

class UploadController {
  async uploadProductImage(req, res, next) {
    try {
      const file = uploadService.uploadProductImage(req);

      return res.status(201).json({
        success: true,
        message: "Imagem enviada com sucesso.",
        data: file
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();