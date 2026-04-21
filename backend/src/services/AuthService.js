const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const AppError = require("../utils/app-error");

class AuthService {
  async register(data) {
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim().toLowerCase();
    const password = String(data.password || "").trim();
    const role = data.role === "admin" ? "admin" : "user";

    if (!name) {
      throw new AppError("O nome é obrigatório.", 400);
    }

    if (!email) {
      throw new AppError("O e-mail é obrigatório.", 400);
    }

    if (!password || password.length < 6) {
      throw new AppError("A senha deve ter pelo menos 6 caracteres.", 400);
    }

    const existingUser = await UserRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("Já existe um usuário com esse e-mail.", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return UserRepository.create({
      name,
      email,
      password: hashedPassword,
      role
    });
  }

  async login(data) {
    const email = String(data.email || "").trim().toLowerCase();
    const password = String(data.password || "").trim();

    if (!email || !password) {
      throw new AppError("E-mail e senha são obrigatórios.", 400);
    }

    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new AppError("Credenciais inválidas.", 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || "minha-chave-secreta",
      { expiresIn: "1d" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }
}

module.exports = new AuthService();