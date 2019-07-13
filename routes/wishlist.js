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

router.get("/:userid", async function(req, res) {
  console.log("GET request for wishlist of user with id: " + req.params.userid);
  const [results, metadata] = await pool.execute(
    `SELECT history_events.* FROM history_events INNER JOIN saved_events ON history_events.id = saved_events.eventId WHERE userId=?`,
    [req.params.userid]
  );
  res.send(results);
});

module.exports = router;
