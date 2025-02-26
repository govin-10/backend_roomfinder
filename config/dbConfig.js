//required configuration for the sequlize connection
require("dotenv").config();

module.exports = {
  dbConfig: {
    db: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
