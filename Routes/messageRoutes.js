require("dotenv").config();
const express = require("express");
const router = express.Router();
const messageDataAccess = require("../DataAccess/messageDataAccess");
const socketService = require("../Services/socketService");
const exjwt = require("express-jwt");
const { response } = require("express");
const io = socketService.getIo();

const jwtMW = exjwt({
  secret: process.env.JWT_KEY,
  algorithms: ["HS256"],
});

router.get("/", jwtMW, async (req, res) => {
  const updateMessages = await messageDataAccess.queryMessages();
  res.status(201).send(updateMessages);
  io.emit("get_messages", JSON.stringify(updateMessages));
});
router.post("/", jwtMW, async (req, res) => {
  let newMessage = {
    id: req.body.id,
    username: req.body.username,
    text: req.body.text,
  };

  const newMessageId = req.body.id;
  const newMessageText = req.body.text;

  let responseMessage = await messageDataAccess.createMessage(
    newMessageId,
    newMessageText
  );

  responseMessage.username = newMessage.username;
  const updateMessages = await messageDataAccess.queryMessages();
  res.status(201).send(updateMessages);
  io.emit("message", JSON.stringify(updateMessages));
});
module.exports = router;
