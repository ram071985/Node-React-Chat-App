const bcrypt = require("bcrypt");
const saltRounds = 10;
const pgDataAccess = require("./pgDataAccess");

createNewUser = async (username, password) => {
    let pool = await pgDataAccess.dbConnection();
    await pool.query("BEGIN");
    await pool.query(
        
    )
}