const bcrypt = require("bcrypt");
const pgDataAccess = require("./pgDataAccess");
require("dotenv").config();
const jwt = require("jsonwebtoken");

logInUser = async (username, password) => {
  let pool = await pgDataAccess.dbConnection();
  console.log("connected to login");
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const saltedPassword = result.rows[0].password;
    const match = await bcrypt.compare(password, saltedPassword);

    if (!match) {
      return {
        isSuccessful: false,
        errorMessage: "Incorrect password",
      };
    } else {
      await pool.query("BEGIN");
      await pool.query(
        "UPDATE users SET last_active_at = NOW() WHERE username = $1",
        [username]
      );
      await pool.query(
        "UPDATE users SET is_logged_in = true WHERE username = $1",
        [username]
      );
      await pool.query("COMMIT");
    }
    let token = jwt.sign(
      { username: result.rows[0].username },
      process.env.SECRET,
      { expiresIn: "1d" }
    );
    let successfulLogin = {
      isSuccesful: true,
      user: result.rows[0],
      secretToken: token,
    };
    console.log(result.rows[0]);
    return successfulLogin;
  } catch (err) {
    console.log(err);
    return {
      isSuccesful: false,
      errorMessage:"This username does not exist. Please register."
    }
  } finally {
    pool.release();
  }
};

logOutUser = async (username) => {
  let pool = await pgDataAccess.dbConnection();
  try {
    await pool.query("BEGIN");
    const results = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    await pool.query(
      "UPDATE users SET is_logged_in = false WHERE username = $1",
      [username]
    );
    await pool.query("COMMIT");
  } catch (err) {
    console.log(err);
  } finally {
    pool.release();
  }
};

module.exports = { logInUser, logOutUser };
