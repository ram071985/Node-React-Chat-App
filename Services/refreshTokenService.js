require("dotenv").config();
const jwt = require("jsonwebtoken");

refreshToken = async (username) => {
  let token = jwt.sign({ username: username }, process.env.SECRET, {
    expiresIn: 129600,
  });

  newToken = {
    secretToken: token,
  };

  return newToken;
};

module.exports = { refreshToken };
