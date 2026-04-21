const express = require("express");
const uploadController = require("../controllers/UploadController");
const { authMiddleware, adminOnly } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.post(
  "/products/image",
  authMiddleware,
  adminOnly,
  upload.single("image"),
  uploadController.uploadProductImage.bind(uploadController)
);

module.exports = router;