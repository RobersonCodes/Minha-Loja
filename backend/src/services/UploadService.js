class UploadService {
  buildFileUrl(req, filename) {
    return `${req.protocol}://${req.get("host")}/uploads/products/${filename}`;
  }

  uploadProductImage(req) {
    if (!req.file) {
      throw new Error("Nenhuma imagem enviada.");
    }

    return {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: this.buildFileUrl(req, req.file.filename)
    };
  }
}

module.exports = new UploadService();