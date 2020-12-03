require("dotenv").config();
const { Pool } = require("pg");

const config = {
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
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
