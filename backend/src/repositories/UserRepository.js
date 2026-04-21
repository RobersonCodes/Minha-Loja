const db = require("../config/database");

class UserRepository {
  findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, name, email, password, role FROM users WHERE email = ?`,
        [email],
        (error, row) => {
          if (error) {
            return reject(error);
          }

          resolve(row);
        }
      );
    });
  }

  create(user) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        [user.name, user.email, user.password, user.role],
        function (error) {
          if (error) {
            return reject(error);
          }

          resolve({
            id: this.lastID,
            name: user.name,
            email: user.email,
            role: user.role
          });
        }
      );
    });
  }
}

module.exports = new UserRepository();