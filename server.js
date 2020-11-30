const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const pgDataAccess = require("./DataAccess/pgDataAccess");
const http = require("http");
const server = http.createServer(http);
const socketio = require("socket.io");
const io = socketio(server);
require("dotenv").config();

app.use("/", express.static(path.join(__dirname, "client/build")));

pgDataAccess.dbConnection();

app.post("/api/authorize", async (req, res) => {
  const config = {
    params: {
      username: req.query.username,
      password: req.query.password,
    },
  };
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
