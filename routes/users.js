var express = require("express");
var router = express.Router();
var mysql = require("mysql2/promise");
var auth = require('../auth');

let pool;
(async function initializePool() {
  pool = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "historynow",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
})();

router.get("/", async function(req, res) {
  console.log("GET request for all users");
  const [results, metadata] = await pool.execute("SELECT * FROM users");
  res.send(results);
});

router.get("/:id", async function(req, res) {
  const [results, metadata] = await pool.execute(
    `SELECT * FROM users WHERE id=?`,
    [req.params.id]
  );
  res.send(results);
});

router.post("/", async function(req, res) {
  console.log(req.body);
  const [results, metadata] = await pool.execute(
    `INSERT INTO users (firstName, lastName, email, username, userPassword, isAdmin) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      req.body.username,
      req.body.userPassword,
      req.body.isAdmin
    ]
  );
  res.send({ status: "success", addedUsername: req.body.username });
});

router.delete("/:id", async function(req, res) {
  const [results, metadata] = await pool.execute(
    `DELETE FROM users WHERE id=?`,
    [req.params.id]
  );
  res.send({ status: "success", deletedId: req.params.id });
});

router.put("/:id", async function(req, res) {
  console.log(req.body);
  const [results, metadata] = await pool.execute(
    `UPDATE users SET firstName=?, lastName=?, email=?, userPassword=? WHERE id=?`,
    [req.body.title, req.body.description, req.params.id]
  );
  res.send({ status: "success", updatedId: req.params.id });
});

module.exports = router;
