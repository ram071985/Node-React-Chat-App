require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const http = require("http");
const server = https.createServer(app);
const exjwt = require("express-jwt");
const socketService = require("./Services/socketService");
const io = socketService.getIo(server);


io.on("connection", (socket) => {
  socket.emit("new_message", "sockets connected");
});

app.use("/", express.static(path.join(__dirname, "client/build")));

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));

const userRoutes = require("./Routes/userRoutes");
app.use("/api/users", userRoutes);

const messageRoutes = require("./Routes/messageRoutes");
app.use("/api/messages", messageRoutes);

const authRoutes = require("./Routes/authRoutes");
app.use("/api/authorize", authRoutes);

app.get("/*", async (req, res) => {
  console.log("Web Token Checked.");
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
