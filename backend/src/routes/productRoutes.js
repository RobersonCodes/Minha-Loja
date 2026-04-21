const express = require("express");
const ProductController = require("../controllers/ProductController");
const asyncHandler = require("../utils/async-handler");
const { authMiddleware, adminOnly } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", asyncHandler((req, res, next) => ProductController.getAll(req, res, next)));
router.get("/:id", asyncHandler((req, res, next) => ProductController.getById(req, res, next)));

router.post(
  "/",
  authMiddleware,
  adminOnly,
  asyncHandler((req, res, next) => ProductController.create(req, res, next))
);

router.put(
  "/:id",
  authMiddleware,
  adminOnly,
  asyncHandler((req, res, next) => ProductController.update(req, res, next))
);

router.delete(
  "/:id",
  authMiddleware,
  adminOnly,
  asyncHandler((req, res, next) => ProductController.delete(req, res, next))
);

module.exports = router;