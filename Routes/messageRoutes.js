require("dotenv").config();
const express = require("express");
const router = express.Router();
const messageDataAccess = require("../DataAccess/messageDataAccess");
const socketService = require("../Services/socketService");
const exjwt = require("express-jwt");
const io = socketService.getIo();

const jwtMW = exjwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
});

router.get("/", jwtMW, async (req, res) => {
  const messages = await messageDataAccess.queryMessages();
  res.send(messages);
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

  io.emit("message", JSON.stringify(responseMessage));
});
module.exports = router;
