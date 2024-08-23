const mysql = require("mysql");

//required configuration for the sql connection
const dbConfig = {
  user: "root",
  host: "localhost",
  password: "",
  database: "roomfinde_db",
};

//creating the connection
const sqlConnection = mysql.createConnection(dbConfig);

module.exports = { sqlConnection };
