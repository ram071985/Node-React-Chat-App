require("dotenv").config();
const jwt = require("jsonwebtoken");

getToken = async (username) => {
  let token = jwt.sign({ username: username }, process.env.SECRET, {
    expiresIn: 900000,
  });

  newToken = {
    secretToken: token,
  };

  return newToken;
};

module.exports = { getToken };
