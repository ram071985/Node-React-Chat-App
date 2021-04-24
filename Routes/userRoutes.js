require("dotenv").config();
const express = require("express");
const router = express.Router();
const userDataAccess = require("../DataAccess/userDataAccess");
const socketService = require("../Services/socketService");
const exjwt = require("express-jwt");
const io = socketService.getIo();

const jwtMW = exjwt({
  secret: process.env.JWT_KEY,
  algorithms: ["HS256"],
});

router.get("/", jwtMW, async (req, res) => {
  const users = await userDataAccess.queryUsers();

  res.status(201).send(users);
console.log("user online",users)
  io.emit("get_users", JSON.stringify(users));
});

router.get("/inactive", jwtMW, async (req, res) => {
  const users = await userDataAccess.queryInactiveUsers();

  res.status(201).send(users);
console.log("offline users", users)
  io.emit("get_offline_users", JSON.stringify(users));
});

router.post("/", async (req, res) => {
  const newUsername = req.body.username;
  const password = req.body.password;

  let newUser = await userDataAccess.createUser(newUsername, password);

  res.status(201).send({ newUser });

  io.emit("user_online", JSON.stringify(newUser));
});

module.exports = router;
