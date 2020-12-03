require("dotenv").config();
const { Pool } = require("pg");

const config = {
  //connectionString: process.env.CONNECTION_STRING,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  port: process.env.PG_PORT,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST
};

dbConnection = async () => {
  const pool = new Pool(config);
  await pool.connect();
  console.log("connected to chat_app database");
  return pool;
};

module.exports = { dbConnection };
