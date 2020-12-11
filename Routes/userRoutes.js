const express = require("express");
const router = express.Router();
const userDataAccess = require("../DataAccess/userDataAccess");
const socketService = require("../Services/socketService");
const io = socketService.getIo();

router.get("/", async (req, res) => {
  const users = await userDataAccess.queryUsers();
  res.send(users);
});

router.post("/", async (req, res) => {
  const newUsername = req.body.username;
  const password = req.body.password;

  let newUser = await userDataAccess.createUser(newUsername, password);

  res.status(201).send({ newUser });

  io.emit("user_online", JSON.stringify(newUser));
});

module.exports = router;
