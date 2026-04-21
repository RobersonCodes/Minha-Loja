const express = require("express");
const AuthController = require("../controllers/AuthController");
const asyncHandler = require("../utils/async-handler");

const router = express.Router();

router.post("/register", asyncHandler((req, res) => AuthController.register(req, res)));
router.post("/login", asyncHandler((req, res) => AuthController.login(req, res)));

module.exports = router;