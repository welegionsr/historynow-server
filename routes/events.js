var express = require("express");
var router = express.Router();
var mysql = require("mysql2/promise");

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
  console.log("GET request for all events");
  const [results, metadata] = await pool.execute(
    "SELECT * FROM history_events"
  );
  res.send(results);
});

router.get("/:id", async function(req, res) {
  const [results, metadata] = await pool.execute(
    `SELECT * FROM history_events WHERE id=?`,
    [req.params.id]
  );
  res.send(results);
});

router.post("/", async function(req, res) {
  console.log(req.body);
  const [results, metadata] = await pool.execute(
    `INSERT INTO history_events (typeOfEvent, country, city, price, eventDate, eventTitle, eventDesc, eraId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      req.body.typeOfEvent,
      req.body.country,
      req.body.city,
      req.body.price,
      req.body.eventDate,
      req.body.eventTitle,
      req.body.eventDesc,
      req.body.eraId
    ]
  );
  res.send({ status: "success", addedUsername: req.body.username });
});

router.delete("/:id", async function(req, res) {
  const [results, metadata] = await pool.execute(
    `DELETE FROM history_events WHERE id=?`,
    [req.params.id]
  );
  res.send({ status: "success", deletedId: req.params.id });
});

router.put("/:id", async function(req, res) {
  console.log(req.body);
  const [results, metadata] = await pool.execute(
    `UPDATE history_events SET firstName=?, lastName=?, email=?, userPassword=? WHERE id=?`,
    [req.body.title, req.body.description, req.params.id]
  );
  res.send({ status: "success", updatedId: req.params.id });
});

module.exports = router;
