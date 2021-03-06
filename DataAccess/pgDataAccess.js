require("dotenv").config();
const { Pool } = require("pg");

const config = {
  //connectionString: process.env.CONNECTION_STRING,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  port: process.env.PG_PORT,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
};

let pool = new Pool(config);

getClient = async () => {
  console.log("connected to chat database");
  return pool.connect();
};

module.exports = { dbConnection: getClient };
