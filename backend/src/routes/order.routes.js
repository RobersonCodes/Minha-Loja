const express = require("express");
const OrderController = require("../controllers/order.controller");

const router = express.Router();

router.post("/", (req, res, next) => OrderController.create(req, res, next));
router.get("/", (req, res, next) => OrderController.findAll(req, res, next));
router.get("/:id", (req, res, next) => OrderController.findById(req, res, next));
router.patch("/:id/status", (req, res, next) => OrderController.updateStatus(req, res, next));

module.exports = router;