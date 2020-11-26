const express = require("express");
const app = express();
const path = require('path');
const port = 3000;
const pgAccess = require("./DataAccess/pgAccess");
const http = require('http');
const server  = http.createServer(http);
const socketio = require('socket.io');
const io = socketio(server);
require('dotenv').config();

pgAccess.

app.use("/", express.static(path.join(__dirname, "client/build")));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));