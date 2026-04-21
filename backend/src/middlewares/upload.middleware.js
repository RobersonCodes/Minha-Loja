const path = require("path");
const fs = require("fs");
const multer = require("multer");

const uploadDir = path.resolve(__dirname, "../../uploads/products");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const uniqueName = `${Date.now()}-${baseName || "product"}${extension}`;
    cb(null, uniqueName);
  }
});

function fileFilter(req, file, cb) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Formato de imagem inválido. Envie JPG, JPEG, PNG ou WEBP."));
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = upload;