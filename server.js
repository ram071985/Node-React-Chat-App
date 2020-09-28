const express = require("express");
const app = express();
const port = 3000;
require('dotenv').config()
const axios = require("axios");

app.use("/", express.static(path.join(__dirname, "client/build")));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));