const http = require('http');
const express = require("express");
const server  = http.createServer(http);
const socketio = require('socket.io');
const io = socketio(server);
const app = express();
const path = require('path');
const port = 3000;
require('dotenv').config()
const axios = require("axios");

app.use("/", express.static(path.join(__dirname, "client/build")));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));