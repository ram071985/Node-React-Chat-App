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

const messageRoutes = require("./Routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const authRoutes = require("./Routes/authRoutes");
app.use("/api/authorize", authRoutes);

app.get("/*", async (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
