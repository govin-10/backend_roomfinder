const { dbConfig } = require("../config/dbConfig");

const { Sequelize, DataTypes } = require("sequelize");

require("dotenv").config();

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  pool: dbConfig.pool,
});

sequelize.authenticate().then(() => {
  console.log("Connection has been established successfully.");
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// importing model files
db.users = require("./userModel.js")(sequelize, DataTypes);
db.otpTable = require("./otpModel.js")(sequelize, DataTypes);
db.roomTable = require("./roomModel.js")(sequelize, DataTypes);
db.paymentInfoTable = require("./paymentModel.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done");
});

module.exports = db;
