const jwt = require("jsonwebtoken");
const AppError = require("../utils/app-error");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Token não informado.", 401));
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return next(new AppError("Token inválido.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "minha-chave-secreta");
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Token inválido ou expirado.", 401));
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Acesso restrito ao administrador.", 403));
  }

  next();
}

module.exports = {
  authMiddleware,
  adminOnly
};