require("dotenv").config();
const { Pool } = require("pg");

const config = {
	connectionString: process.env.CONNECTION_STRING,
};

dbConnection = async () => {
  const pool = new Pool(config);

  if (pool) {
    return pool;
  } else {
    try {
      await pool.connect();
      console.log("connected to chat_app database");
      return pool;
    } catch (err) {
      console.log("Not connected to DB" + err);
    }
  }
};

module.exports = { dbConnection };
