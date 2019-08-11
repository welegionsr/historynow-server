var express = require("express");
var router = express.Router();
var mysql = require("mysql2/promise");
var auth = require("../auth");
const { User } = require("../models/User");

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
  console.log("GET request for all users");
  // const [results, metadata] = await pool.execute("SELECT * FROM users");
  const users = await User.find().exec();
  res.send(users);
});

router.get("/:id", async function(req, res) {
  // const [results, metadata] = await pool.execute(
  //   `SELECT * FROM users WHERE id=?`,
  //   [req.params.id]
  // );
  const { id } = req.params;
  await User.findById(id, (err, doc) => {
    if (err)
      res
        .status(404)
        .send({ status: "failed", message: "no user with this ID!", err });
    res.send({ status: "success", doc });
  });
});

router.post("/", async function(req, res) {
  console.log(req.body);
  // const [results, metadata] = await pool.execute(
  //   `INSERT INTO users (firstName, lastName, email, username, userPassword, isAdmin) VALUES (?, ?, ?, ?, ?, ?)`,
  //   [
  //     req.body.firstName,
  //     req.body.lastName,
  //     req.body.email,
  //     req.body.username,
  //     req.body.userPassword,
  //     req.body.isAdmin
  //   ]
  // );
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    userPassword: req.body.userPassword,
    isAdmin: false //forcing it for now
  });

  await User.findOne({ username: newUser.username }, async (err, doc) => {
    //if result was found
    if (doc) {
      console.log("username already exists!");
      res
        .status(401)
        .send({ status: "failed", message: "username already exists!", err });
    } else {
      //if no result found, add new user
        try {
          const doc = await newUser.save();
          res.status(200).send({ status: "success", doc });
        } catch (err) {
            res.status(400).send({
            status: "failed",
            message: "error while adding new user",
            err
            });
          }
      }
  });

  // try {
  //   const doc = await newUser.save();
  //   res.status(200).send({ status: "success", doc });
  // } catch (err) {
  //   res.status(400).send({
  //     status: "failed",
  //     message: "error while adding new user",
  //     err
  //   });
  // }
  // res.send({ status: "success", addedUsername: req.body.username });
});

router.delete("/:id", async function(req, res) {
  // const [results, metadata] = await pool.execute(
  //   `DELETE FROM users WHERE id=?`,
  //   [req.params.id]
  // );

  const { id } = req.params;
  await User.findByIdAndDelete(id, (err, doc) => {
    if (err)
      res
        .status(404)
        .send({ status: "failed", message: "No user with this ID!", err });
    //if user was found and deleted, send back its details and a confirmation message
    res.send({ status: "success", doc });
  });
  // res.send({ status: "success", deletedId: req.params.id });
});

router.put("/:id", async function(req, res) {
  // console.log(req.body);
  // const [results, metadata] = await pool.execute(
  //   `UPDATE users SET firstName=?, lastName=?, email=?, userPassword=? WHERE id=?`,
  //   [req.body.title, req.body.description, req.params.id]
  // );

  const { id } = req.params;
  const newData = { ...req.body };
  await User.updateOne({ _id: id }, newData, (err, doc) => {
    if (err)
      res
        .status(404)
        .send({ status: "failed", message: "no user with this ID!", err });
    res.send({ status: "success", doc });
  });
  // res.send({ status: "success", updatedId: req.params.id });
});

module.exports = router;
