function errorMiddleware(error, req, res, next) {
  console.error("Erro:", error.message);

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Erro interno do servidor."
  });
}

module.exports = errorMiddleware;