const bcrypt = require("bcrypt");
const pgDataAccess = require("./pgDataAccess");

logInUser = async (username, password) => {
    let pool = await pgDataAccess.dbConnection();
    console.log("connected to login");
    try {
      await pool.query("BEGIN");
      const result = await pool.query(
        "SELECT * FROM users WHERE username = $1", [req.body.username]
      );
      
      //const saltedPassword = result.rows[0].password;
      //const match = await bcrypt.compare(req.body.password, saltedPassword);
      const authUser = result.rows[0];
     console.log(result.rows[0]);
      res.status(201).send({ authUser });
  
    } catch (err) {
      console.log(err);
    }
}

module.export = { logInUser };