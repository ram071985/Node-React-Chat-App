const express = require("express");
const router = express.Router();
const userDataAccess = require("../database/usersAccess");
const socketService = require("../services/socket-service");
const io = socketService.getIo();

router.post("/", async (req, res) => {
  const newUsername = req.body.username;
  const password = req.body.password;

  let newUser = await userDataAccess.createUser(newUserName, password);

  res.status(201).send({ newUser });

  io.emit("user_online", JSON.stringify(newUser));
});
module.exports = router;
