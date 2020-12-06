const pgDataAccess = require("./pgDataAccess");

createMessage = async (userId, text) => {
  let pool = await pgDataAccess.dbConnection();

  try {
    await pool.query("BEGIN");
    const result = await pool.query(
      "INSERT INTO messages(user_id, text) VALUES($1, $2) RETURNING id, created_date, user_id, text",
      [userId, text]
    );
    await pool.query("UPDATE users SET last_active_at = NOW() WHERE id = $1,", [
      userId,
    ]);

    await pool.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    console.log(err);
    await pool.query("ROLLBACK");
  }
};

module.exports = { createMessage };
