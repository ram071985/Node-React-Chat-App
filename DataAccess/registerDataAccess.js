const bcrypt = require("bcrypt");
const saltRounds = 10;
const pgDataAccess = require("./pgDataAccess.js");

logInUser = async (username, password) => {
  let pool = await pgDataAccess.dbConnection();

  try {
    console.log("connected to to create user");
    try {
      const hash = await bcrypt.hashSync(password, saltRounds);
      await pool.query("BEGIN");
      const checkForUser = await pool.query(
        `SELECT * FROM users WHERE username = '${username}';`
      );
      if (checkForUser.rows[0] !== undefined) {
        res.status(401).json({
          message: "username exists",
        });
      } else {
        await pool.query(
          "INSERT INTO users(username, password) VALUES($1, $2)",
          [username, hash]
        );
      }
      await pool.query("COMMIT");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {}
};

module.exports = { logInUser }
