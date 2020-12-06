const express = require("express");
const router = express.Router();
const authDataAccess = require("../DataAccess/authDataAccess");

router.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let userMatch = await authDataAccess.logInUser(username, password);

    res.status(201).send({ userMatch }); 
});

module.exports = router;