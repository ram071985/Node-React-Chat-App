require("dotenv").config();
const express = require("express");
const router = express.Router();
const userDataAccess = require("../DataAccess/userDataAccess");
const exjwt = require("express-jwt");
require("dotenv").config();

const jwtMW = exjwt({
  secret: process.env.JWT_KEY,
  algorithms: ["HS256"],
});
 
router.get("/", jwtMW, async (req, res) => {
  const users = await userDataAccess.queryUsers();
  res.send(users);
});

router.get("/inactive", jwtMW, async (req, res) => {
  const users = await userDataAccess.queryInactiveUsers();
  res.send(users);
});

router.post("/", async (req, res) => {
  const newUsername = req.body.username;
  const password = req.body.password;

  let newUser = await userDataAccess.createUser(newUsername, password);

  res.status(201).send({ newUser });
});

module.exports = router;
