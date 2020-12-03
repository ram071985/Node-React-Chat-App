require("dotenv").config();
const { Pool } = require("pg");

const config = {
  ///connectionString: process.env.CONNECTION_STRING,
  user: process.env.PG_USER,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
};

dbConnection = async () => {
  const pool = new Pool(config);
      await pool.connect();
      console.log("connected to chat_app database");
      return pool;
};

module.exports = { dbConnection };
