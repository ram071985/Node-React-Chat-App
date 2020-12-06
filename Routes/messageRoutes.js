const express = require("express");
const router = express.Router();
const messageDataAccess = require("../DataAccess/messageDataAccess");


router.post("/", async (req,res) => {
    let newMessage = {
        id: req.body.id,
        username: req.body.username,
        text: req.body.text
    }

    const newMessageId = req.body.id;
    const newMessageText = req.body.text;

    let responseMessage = await messageDataAccess.createMessage(
        newMessageId, newMessageText
    )

    responseMessage.username = newMessage.username;
})
module.exports = router;