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
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
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
    no_of_room: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    availableFrom: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false,
    },
    room_status: {
      type: DataTypes.ENUM("available", "occupied", "maintenance"),
      allowNull: false,
      defaultValue: "available",
      validate: {
        isIn: {
          args: [["available", "occupied", "maintenance"]],
          msg: "Room status must be either 'available', 'occupied', or 'maintenance'",
        },
      },
    },
    // room_image_url: {
    //   type: DataTypes.JSON,
    //   allowNull: true,
    // },
    wifi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    parking: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    water: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    disposal_charge: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    electricity: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    admin_approval: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Rooms.associate = (models) => {
    Rooms.belongsTo(models.Users, { foreignKey: "u_id" });
  };

  return Rooms;
};
