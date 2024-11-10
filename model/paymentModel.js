const shortid = require("short-uuid");

module.exports = (sequelize, DataTypes) => {
  const PaymentInfo = sequelize.define("paymentInfo", {
    u_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "u_id",
      },
      onDelete: "CASCADE",
    },
    pay_id: {
      type: DataTypes.STRING,
      unique: true,
      primaryKey: true,
      defaultValue: shortid.generate(),
    },
    acc_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    acch_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bank: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  PaymentInfo.associate = (models) => {
    PaymentInfo.belongsTo(models.Users, { foreignKey: "u_id" });
  };

  return PaymentInfo;
};
