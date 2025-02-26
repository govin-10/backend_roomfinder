module.exports = (sequelize, DataTypes) => {
  const userPreferences = sequelize.define(
    "userPreferences",
    {
      up_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      u_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "u_id",
        },
        onDelete: "CASCADE",
      },
      up_preference: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      min_price: { type: DataTypes.INTEGER, allowNull: false },
      max_price: { type: DataTypes.INTEGER, allowNull: false },
      wifi: { type: DataTypes.BOOLEAN, defaultValue: false },
      electricity: { type: DataTypes.BOOLEAN, defaultValue: false },
      parking: { type: DataTypes.BOOLEAN, defaultValue: false },
      water: { type: DataTypes.BOOLEAN, defaultValue: false },
      disposal_charge: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      timestamps: false,
    }
  );

  userPreferences.associate = (models) => {
    userPreferences.belongsTo(models.users, {
      foreignKey: "u_id",
    });
  };

  return userPreferences;
};
