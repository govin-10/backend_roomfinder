const shortid = require("short-uuid");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("users", {
    u_id: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      defaultValue: `${shortid.generate() + new Date().getTime()}`,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["male", "female"]],
          msg: "Gender must be either 'male' or 'female'",
        },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "homeOwner", "renter"),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Users;
};
