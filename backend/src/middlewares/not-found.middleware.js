function notFoundMiddleware(req, res) {
  return res.status(404).json({
    success: false,
    message: "Rota não encontrada."
  });
}

module.exports = notFoundMiddleware;