const express = require("express");
const router = express.Router();
const messageDataAccess = require("../DataAccess/messageDataAccess");
const socketService = require("../Services/socketService");
const io = socketService.getIo();

router.get("/", async (req, res) => {
  const messages = await messageDataAccess.queryMessages();
  res.send(messages);
});
router.post("/", async (req, res) => {
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
