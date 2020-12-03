const express = require("express");
const router = express.Router();
const app = express();
const port = 3000;
const path = require("path");
const pgDataAccess = require("./DataAccess/pgDataAccess.js");
const http = require("http");
const server = http.createServer(app);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const socketio = require("socket.io");
const io = socketio(server);
require("dotenv").config();

pgDataAccess.dbConnection();

app.use("/", express.static(path.join(__dirname, "client/build")));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: false }))


const jwtMW = exjwt({
  secret: process.env.SECRET, algorithms: ['RS256']
});

app.post("/api/register", async (req, res) => {
  console.log(req);

  let pool = await pgDataAccess.dbConnection();

  const hash = await bcrypt.hashSync(req.body.password, saltRounds);

  await pool.query("BEGIN");
  const result = await pool.query(
    `SELECT * FROM users WHERE username = "${req.body.username}";`
  );
  if (!result) {
    res.status(401).json({ message: "Username already exists" });
  }

  try {
  const insertResult = await pool.query(
    "INSERT INTO users(username, password) VALUES($1, $2)",
    [req.body.username, hash]
  );

  await pool.query("COMMIT");
  console.log(insertResult);
  } catch(err) {

  }

});

app.post("/api/authorize", async (req, res) => {
  const { username, password } = req.body;
});

app.get("/*", async (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
