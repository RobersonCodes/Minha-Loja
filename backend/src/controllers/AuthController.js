const AuthService = require("../services/AuthService");

class AuthController {
  async register(req, res) {
    const user = await AuthService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "Usuário cadastrado com sucesso.",
      data: user
    });
  }

  async login(req, res) {
    const result = await AuthService.login(req.body);

    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso.",
      data: result
    });
  }
}

module.exports = new AuthController();