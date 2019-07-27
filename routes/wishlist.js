var express = require("express");
var router = express.Router();
const { User } = require("../models/User");

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

router.get("/:userId", async function(req, res) {
  console.log("GET request for wishlist of user with id: " + req.params.userId);
  // const [results, metadata] = await pool.execute(
  //   `SELECT history_events.* FROM history_events INNER JOIN saved_events ON history_events.id = saved_events.eventId WHERE userId=?`,
  //   [req.params.userid]
  // );
  // res.send(results);
  const { userId } = req.params;
  await User.findById(userId, (err, doc) => {
    if (err)
      res
        .status(404)
        .send({ status: "failed", message: "no user with this ID!", err });
    //if user was found, send back only the saved events array
    res.send(doc.savedEvents);
  });
});

router.post("/", async function(req, res) {
  const { userId, eventId } = req.body;

  //get user's current wishlist
  let currentWishlist = await User.findById(userId)
    .select({ savedEvents: 1, _id: 0 })
    .exec();

  //add or remove the event in question
  currentWishlist = currentWishlist.toObject().savedEvents;
  if (currentWishlist.includes(eventId))
    currentWishlist = currentWishlist.filter(item => item !== eventId);
  else currentWishlist.push(eventId);

  //apply the change to the DB
  await User.findByIdAndUpdate(
    userId,
    { savedEvents: currentWishlist },
    (err, doc) => {
      if (err)
        res.status(404).send({
          status: "failed",
          message: `failed to change wishlist for user with ID: ${userId}`,
          err
        });
      res.send({ status: "success", message: `wishlist updated successfully for user ${userId}`, doc });
    }
  );
});

module.exports = router;
