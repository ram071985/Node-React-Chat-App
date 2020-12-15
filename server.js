const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const pgDataAccess = require("./DataAccess/pgDataAccess.js");
const http = require("http");
const server = http.createServer(app);
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const socketService = require("./Services/socketService");
const io = socketService.getIo(server);
require("dotenv").config();

io.on("connection", (socket) => {
  socket.emit("new_message", "sockets connected");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

app.use("/", express.static(path.join(__dirname, "client/build")));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));

const jwtMW = exjwt({
  secret: process.env.SECRET,
  algorithms: ["RS256"],
});

const userRoutes = require("./Routes/userRoutes");
app.use("/api/users", userRoutes);

const messageRoutes = require("./Routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const authRoutes = require("./Routes/authRoutes");
app.use("/api/authorize", authRoutes);

app.get("/*", jwtMW, async (req, res) => {
  console.log("Web Token Checked.");
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
