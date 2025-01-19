module.exports = (sequelize, DataTypes) => {
  const Rooms = sequelize.define("rooms", {
    r_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY("POINT"),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    areaSize: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    availableFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    room_status: {
      type: DataTypes.ENUM("available", "occupied", "maintenance"),
      allowNull: false,
      validate: {
        isIn: {
          args: [["available", "occupied", "maintenance"]],
          msg: "Room status must be either 'available', 'occupied', or 'maintenance'",
        },
      },
    },
    room_image_url: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    facilities: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  Rooms.associate = (models) => {
    Rooms.belongsTo(models.Users, { foreignKey: "u_id" });
  };

  return Rooms;
};
