//required configuration for the sequlize connection
require("dotenv").config();
const dbConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  db: process.env.DATABASE,
  dialect: "mysql",
  port: process.env.DB_PORT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

module.exports = { dbConfig };
