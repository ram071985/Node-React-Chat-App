const pgDataAccess = require("./pgDataAccess");

queryMessages = async () => {
  let pool = await pgDataAccess.dbConnection();
  try {
    const results = await pool.query(
      "SELECT m.user_id, m.id, m.created_date, u.username FROM messages AS m INNER JOIN users AS u ON u.id = m.user_id ORDER by m.id;"
    );
    return results.rows;
  } catch (err) {
      console.log(err);
  }
};
createMessage = async (userId, text) => {
  let pool = await pgDataAccess.dbConnection();

  try {
    await pool.query("BEGIN");
    const result = await pool.query(
      "INSERT INTO messages(user_id, text) VALUES($1, $2) RETURNING id, created_date, user_id, text",
      [userId, text]
    );
    await pool.query("UPDATE users SET last_active_at = NOW() WHERE id = $1", [
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
