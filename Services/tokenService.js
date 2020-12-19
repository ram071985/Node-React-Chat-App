require("dotenv").config();
const jwt = require("jsonwebtoken");

getToken = async (username) => {
  let token = jwt.sign({ username: username }, process.env.SECRET, {
    expiresIn: 30,
  });

  newToken = {
    secretToken: token,
  };

  return newToken;
};

module.exports = { getToken };
