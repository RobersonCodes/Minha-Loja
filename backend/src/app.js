const express = require("express");
const cors = require("cors");
const path = require("path");

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const db = require("./config/database");
const errorMiddleware = require("./middlewares/error.middleware");
const notFoundMiddleware = require("./middlewares/not-found.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL CHECK(price > 0),
      old_price REAL,
      category TEXT NOT NULL DEFAULT 'decoracao',
      image TEXT,
      description TEXT DEFAULT 'Produto disponível na loja com ótima apresentação e visual premium.',
      stock INTEGER DEFAULT 10,
      rating REAL DEFAULT 4.5,
      reviews_count INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      badge TEXT DEFAULT '',
      affiliate_url TEXT DEFAULT '',
      is_affiliate INTEGER DEFAULT 0
    )
  `);

  /* garante compatibilidade com bancos antigos */
  db.run(
    `ALTER TABLE products ADD COLUMN affiliate_url TEXT DEFAULT ''`,
    (error) => {
      if (error && !error.message.includes("duplicate column name")) {
        console.error("Erro ao adicionar coluna affiliate_url:", error.message);
      }
    }
  );

  db.run(
    `ALTER TABLE products ADD COLUMN is_affiliate INTEGER DEFAULT 0`,
    (error) => {
      if (error && !error.message.includes("duplicate column name")) {
        console.error("Erro ao adicionar coluna is_affiliate:", error.message);
      }
    }
  );

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_cpf TEXT NOT NULL,
      zip_code TEXT NOT NULL,
      street TEXT NOT NULL,
      number TEXT NOT NULL,
      neighborhood TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      items_count INTEGER NOT NULL,
      subtotal REAL NOT NULL,
      freight REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      product_category TEXT,
      product_image TEXT,
      unit_price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      line_total REAL NOT NULL,
      FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `);
});

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API Minha Loja funcionando 🚀"
  });
});

app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API Minha Loja saudável e operacional."
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/uploads", uploadRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;