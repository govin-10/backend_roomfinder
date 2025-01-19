module.exports = (sequelize, DataTypes) => {
  const RefreshTokens = sequelize.define("refresh_tokens", {
    rt_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    u_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "u_id",
      },
      onDelete: "CASCADE",
    },
    rt_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rt_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rt_expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  RefreshTokens.associate = (models) => {
    RefreshTokens.belongsTo(models.Users, { foreignKey: "u_id" });
  };

  return RefreshTokens;
};
