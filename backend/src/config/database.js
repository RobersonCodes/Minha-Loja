const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbDir = path.resolve(__dirname, "../database");
const dbPath = path.join(dbDir, "store.db");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (error) => {
  if (error) {
    console.error("Erro ao conectar ao SQLite:", error.message);
    return;
  }

  console.log("Banco SQLite conectado com sucesso.");
});

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");
  db.run("PRAGMA journal_mode = WAL");
});

module.exports = db;