const express = require("express");
const router = express.Router();
const authDataAccess = require("../DataAccess/messageDataAccess");


router.post("/messages", async (req,res) => {
    let newMessage = {
        id: req.body.id,
        username: req.body.username,
        text: req.body.text
    }

    const newMessageId = req.body.id;
    const newMessageText = req.body.id;

    let responseMessage = await messageDataAccess.createMessage(
        newMessageId, newMessageText
    )

    returnedMessage.username = newMessage.username;
})
module.exports = router;