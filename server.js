const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const pgDataAccess = require("./DataAccess/pgDataAccess.js");
const http = require("http");
const server = http.createServer(app);
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const socketio = require("socket.io");
const io = socketio(server);
require("dotenv").config();

app.use("/", express.static(path.join(__dirname, "client/build")));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));

const jwtMW = exjwt({
  secret: process.env.SECRET,
  algorithms: ["RS256"],
});

const registerRoutes = require("./Routes/registerRoutes");
app.use("/api/register", registerRoutes);

const authRoutes = require("./Routes/authRoutes")
app.use("api/login", authRoutes);

app.post("/api/authorize", async (req, res) => {
  let pool = await pgDataAccess.dbConnection();
  console.log("connected to login");
  try {
    await pool.query("BEGIN");
    const result = await pool.query(
      "SELECT * FROM users WHERE username = $1", [req.body.username]
    );
    
    //const saltedPassword = result.rows[0].password;
    //const match = await bcrypt.compare(req.body.password, saltedPassword);
    const authUser = result.rows[0];
   console.log(result.rows[0]);
    res.status(201).send({ authUser });

  } catch (err) {
    console.log(err);
  }
});

app.get("/*", async (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`));
