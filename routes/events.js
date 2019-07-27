var express = require("express");
var router = express.Router();
const { Event } = require("../models/Event");

// var mysql = require("mysql2/promise");

// let pool;
// (async function initializePool() {
//   pool = await mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "1234",
//     database: "historynow",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
//   });
// })();

router.get("/", async function(req, res) {
  console.log("GET request for all events");
  // const [results, metadata] = await pool.execute(
  //   "SELECT * FROM history_events"
  // );
  const events = await Event.find().exec();
  res.send(events);
});

router.get("/:id", async function(req, res) {
  // const [results, metadata] = await pool.execute(
  //   `SELECT * FROM history_events WHERE id=?`,
  //   [req.params.id]
  // );
  const { id } = req.params;
  await Event.findById(id, (err, doc) => {
    if (err)
      res
        .status(404)
        .send({ status: "failed", message: "no event with this ID!", err });
    res.send({ status: "success", doc });
  });
});

router.post("/", async function(req, res) {
  console.log(req.body);
  // const [results, metadata] = await pool.execute(
  //   `INSERT INTO history_events (typeOfEvent, country, city, price, eventDate, eventTitle, eventDesc, eraId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  //   [
  //     req.body.typeOfEvent,
  //     req.body.country,
  //     req.body.city,
  //     req.body.price,
  //     req.body.eventDate,
  //     req.body.eventTitle,
  //     req.body.eventDesc,
  //     req.body.eraId
  //   ]
  // );
  const newEvent = new Event(...req.body);
  try {
    const doc = await newEvent.save();
    res.status(200).send({ status: "success", doc });
  } catch (err) {
    res
      .status(400)
      .send({ status: "failed", message: "error while adding new event", err });
  }
  // res.send({ status: "success", addedUsername: req.body.username });
});

router.delete("/:id", async function(req, res) {
  // const [results, metadata] = await pool.execute(
  //   `DELETE FROM history_events WHERE id=?`,
  //   [req.params.id]
  // );
  const { id } = req.params;
  await Event.findByIdAndDelete(id, (err, doc) => {
    if (err)
      res
        .status(404)
        .send({ status: "failed", message: "No event with this ID!", err });
    //if event was found and deleted, send back its details and a confirmation message
    res.send({ status: "success", doc });
  });
});

router.put("/:id", async function(req, res) {
  console.log(req.body);
  // const [results, metadata] = await pool.execute(
  //   `UPDATE history_events SET firstName=?, lastName=?, email=?, userPassword=? WHERE id=?`,
  //   [req.body.title, req.body.description, req.params.id]
  // );
  const { id } = req.params;
  const newData = { ...req.body };
  await Event.updateOne({ _id: id }, newData, (err, doc) => {
    if (err)
      res
        .status(404)
        .send({ status: "failed", message: "no event with this ID!", err });
    res.send({ status: "success", doc });
  });
  // res.send({ status: "success", updatedId: req.params.id });
});

module.exports = router;
