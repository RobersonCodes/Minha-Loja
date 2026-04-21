const express = require("express");
const adminController = require("../controllers/AdminController");
const { authMiddleware, adminOnly } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get(
  "/metrics",
  authMiddleware,
  adminOnly,
  adminController.getMetrics.bind(adminController)
);

module.exports = router;