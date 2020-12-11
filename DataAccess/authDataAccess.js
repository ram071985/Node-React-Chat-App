const bcrypt = require("bcrypt");
const pgDataAccess = require("./pgDataAccess");

logInUser = async (username, password) => {
  let pool = await pgDataAccess.dbConnection();
  console.log("connected to login");
  try {
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
    //const saltedPassword = result.rows[0].password;
    //const match = await bcrypt.compare(req.body.password, saltedPassword);
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const authUser = {
      user: result.rows[0],
    };
    console.log(result.rows[0]);
    return authUser;
  } catch (err) {
    console.log(err);
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
  }
};

module.exports = { logInUser, logOutUser };
