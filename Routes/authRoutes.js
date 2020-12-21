const express = require("express");
const router = express.Router();
const authDataAccess = require("../DataAccess/authDataAccess");
const tokenService = require("../Services/tokenService.js");

router.post("/login", async (req, res) => {
 
  const username = req.body.username;
  const password = req.body.password;

  let userMatch = await authDataAccess.logInUser(username, password);

  if (!userMatch.isSuccesful) {
    res.status(401).json({
      message: userMatch.errorMessage,
    });
  } else {
    res.status(201).send({ userMatch });
  }
});

router.post("/logout", async (req, res) => {
  const username = req.body.username;

  const id = (logOutUser = await authDataAccess.logOutUser(username));

  res.status(201).send({ logOutUser });
});

router.post("/token", async (req, res) => {
  const username = req.body.username;

  let newToken = await tokenService.getToken(username);

  res.status(201).send({ newToken });
})

module.exports = router;
